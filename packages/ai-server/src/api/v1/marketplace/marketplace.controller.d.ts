import { Request, Response, NextFunction } from 'express';
export declare class MarketplaceController {
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static install(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getInstalled(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=marketplace.controller.d.ts.map