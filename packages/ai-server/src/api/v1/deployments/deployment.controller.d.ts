import { Request, Response, NextFunction } from 'express';
export declare class DeploymentController {
    static trigger(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=deployment.controller.d.ts.map