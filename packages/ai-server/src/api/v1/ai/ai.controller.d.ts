import { Request, Response, NextFunction } from 'express';
export declare class AIController {
    static generate(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static chat(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static streamGenerate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deploy(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map