import { Request, Response, NextFunction } from 'express';
export declare class SandboxController {
    static provision(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getStatus(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static execute(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static stop(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=sandbox.controller.d.ts.map