import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    static signup(req: Request, res: Response, next: NextFunction): Promise<void>;
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verify(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map