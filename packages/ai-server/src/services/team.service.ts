import { prisma } from '../core/database.js';
import { NotFoundError, UnauthorizedError } from '../core/errors.js';

export class TeamService {
  static async createTeam(tenantId: string, userId: string, name: string) {
    const team = await prisma.team.create({
      data: {
        name,
        tenantId,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      },
      include: { members: true }
    });
    return team;
  }

  static async getTeams(tenantId: string, userId: string) {
    return prisma.team.findMany({
      where: {
        tenantId,
        members: { some: { userId } }
      },
      include: {
        members: { include: { user: { select: { name: true, email: true, avatar: true } } } },
        _count: { select: { projects: true } }
      }
    });
  }

  static async inviteMember(teamId: string, inviterId: string, email: string, role: string = 'member') {
    // Check if inviter has permission
    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId: inviterId }
    });

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new UnauthorizedError('Only owners and admins can invite members');
    }

    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        role,
        token: Math.random().toString(36).substring(7), // Simple token
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return invitation;
  }

  static async getTeamProjects(teamId: string, userId: string) {
    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId }
    });

    if (!membership) throw new UnauthorizedError('Unauthorized access to team projects');

    return prisma.project.findMany({
      where: { teamId, deletedAt: null },
      orderBy: { updatedAt: 'desc' }
    });
  }
}
