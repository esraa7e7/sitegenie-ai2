import { Request, Response, NextFunction } from 'express';
import { signupSchema, loginSchema } from '../../../auth/validation.js';
import { generateToken } from '../../../auth/jwt.js';
import { prisma } from '../../../core/database.js';
import { hashPassword, comparePassword } from '../../../auth/crypto.js';
import { BadRequestError, UnauthorizedError } from '../../../core/errors.js';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = signupSchema.parse(req.body);
      const { email, password, name, tenantName } = validated;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new BadRequestError('User already exists');

      const hashedPassword = await hashPassword(password);

      // Create Tenant, Project, and User in a transaction
      const result = await prisma.$transaction(async (tx: any) => {
        const tenant = await tx.tenant.create({
          data: {
            name: tenantName || `${name}'s Org`,
            plan: 'FREE'
          }
        });

        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: 'OWNER',
            tenantId: tenant.id
          }
        });

        return { user, tenant };
      });

      const token = generateToken({ userId: result.user.id, tenantId: result.tenant.id });

      res.status(201).json({
        status: 'success',
        data: {
          user: { id: result.user.id, email: result.user.email, name: result.user.name },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const { email, password } = validated;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) throw new UnauthorizedError('Invalid credentials');

      const isValid = await comparePassword(password, user.password);
      if (!isValid) throw new UnauthorizedError('Invalid credentials');

      const token = generateToken({ userId: user.id, tenantId: user.tenantId });

      res.json({
        status: 'success',
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response) {
    // Middleware already verified token
    res.json({ status: 'success' });
  }
}
