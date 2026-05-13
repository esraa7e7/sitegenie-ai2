import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../../../services/team.service.js';

export class TeamController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const { tenantId, id: userId } = (req as any).user;

      const team = await TeamService.createTeam(tenantId, userId, name);
      res.status(201).json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, id: userId } = (req as any).user;
      const teams = await TeamService.getTeams(tenantId, userId);
      res.json({ status: 'success', data: teams });
    } catch (error) {
      next(error);
    }
  }

  static async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamId, email, role } = req.body;
      const { id: userId } = (req as any).user;

      const invitation = await TeamService.inviteMember(teamId, userId, email, role);
      res.status(201).json({ status: 'success', data: invitation });
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = req.params.id as string;
      const { id: userId } = (req as any).user;
      
      const projects = await TeamService.getTeamProjects(teamId, userId);
      res.json({ status: 'success', data: projects });
    } catch (error) {
      next(error);
    }
  }
}
