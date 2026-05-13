import { Router } from 'express';
import { ProjectController } from './project.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ProjectController.getProjects);
router.post('/', ProjectController.createProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/:id/files', ProjectController.getFiles);
router.get('/:id/files/content', ProjectController.getFileContent);
router.post('/:id/files', ProjectController.updateFile);

// VFS Cache & Snapshot Routes
router.post('/:id/vfs/cache', ProjectController.autoSaveVfs);
router.post('/:id/snapshots', ProjectController.createSnapshot);
router.post('/:id/snapshots/:snapshotId/restore', ProjectController.restoreSnapshot);

export default router;
