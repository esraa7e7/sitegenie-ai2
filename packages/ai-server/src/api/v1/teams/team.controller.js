import { TeamService } from '../../../services/team.service.js';
export class TeamController {
    static async create(req, res, next) {
        try {
            const { name } = req.body;
            const { tenantId, id: userId } = req.user;
            const team = await TeamService.createTeam(tenantId, userId, name);
            res.status(201).json({ status: 'success', data: team });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const { tenantId, id: userId } = req.user;
            const teams = await TeamService.getTeams(tenantId, userId);
            res.json({ status: 'success', data: teams });
        }
        catch (error) {
            next(error);
        }
    }
    static async invite(req, res, next) {
        try {
            const { teamId, email, role } = req.body;
            const { id: userId } = req.user;
            const invitation = await TeamService.inviteMember(teamId, userId, email, role);
            res.status(201).json({ status: 'success', data: invitation });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProjects(req, res, next) {
        try {
            const teamId = req.params.id;
            const { id: userId } = req.user;
            const projects = await TeamService.getTeamProjects(teamId, userId);
            res.json({ status: 'success', data: projects });
        }
        catch (error) {
            next(error);
        }
    }
}
