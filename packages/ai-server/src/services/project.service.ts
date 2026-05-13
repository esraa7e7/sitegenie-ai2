import { ProjectRepository } from '../repositories/project.repository.js';
import { NotFoundError } from '../core/errors.js';
import { FileService } from './file.service.js';
import { VfsService } from './vfs.service.js';
import { prisma } from '../core/database.js';

export class ProjectService {
  private projectRepo: ProjectRepository;

  constructor() {
    this.projectRepo = new ProjectRepository();
  }

  async getAllProjects(tenantId: string) {
    return this.projectRepo.findAll(tenantId);
  }

  async getProjectDetails(tenantId: string, projectId: string) {
    const project = await this.projectRepo.findByTenantAndId(tenantId, projectId);
    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async createProject(tenantId: string, name: string, description?: string) {
    const user = await prisma.user.findFirst({ where: { tenantId } }); // In a real app, this comes from context
    if (!user) throw new Error('User not found');

    const project = await this.projectRepo.create({
      name,
      description,
      tenantId,
      userId: user.id,
      files: {},
    });

    // Initialize physical workspace
    await FileService.syncProjectToDisk(project.id, {
      'README.md': `# ${name}\n${description || ''}`,
      'src/index.ts': '// Entry point\nconsole.log("Hello SiteGenie!");'
    });

    // Seed VFS
    await VfsService.autoSave(project.id, [
       { path: 'README.md', content: `# ${name}\n${description || ''}` },
       { path: 'src/index.ts', content: '// Entry point\nconsole.log("Hello SiteGenie!");' }
    ]);

    return project;
  }

  async deleteProject(tenantId: string, projectId: string) {
    const project = await this.projectRepo.findByTenantAndId(tenantId, projectId);
    if (!project) throw new NotFoundError('Project not found or already deleted');
    return this.projectRepo.softDelete(projectId);
  }

  async updateProjectFile(projectId: string, filePath: string, content: string) {
    // Write to disk AND cache
    await FileService.writeProjectFile(projectId, filePath, content);
    
    const files = await VfsService.getProjectFiles(projectId);
    const existingIndex = files.findIndex(f => f.path === filePath);
    if (existingIndex > -1) {
      files[existingIndex].content = content;
    } else {
      files.push({ path: filePath, content });
    }
    await VfsService.autoSave(projectId, files);
  }

  async getProjectFiles(projectId: string) {
    return VfsService.getProjectFiles(projectId);
  }

  async readFile(projectId: string, filePath: string) {
    const file = await VfsService.getFile(projectId, filePath);
    return file?.content || FileService.readProjectFile(projectId, filePath);
  }
}
