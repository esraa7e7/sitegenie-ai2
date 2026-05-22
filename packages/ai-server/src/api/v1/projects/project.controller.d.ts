import { Request, Response, NextFunction } from 'express';
export declare class ProjectController {
    static getProjects(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFiles(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFileContent(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static autoSaveVfs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createSnapshot(req: Request, res: Response, next: NextFunction): Promise<void>;
    static restoreSnapshot(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=project.controller.d.ts.map