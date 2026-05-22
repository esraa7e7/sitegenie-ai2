import { prisma } from '../core/database.js';
import { SocketService } from '../core/socket.js';
export class CommentService {
    static async addComment(projectId, userId, content, position) {
        const comment = await prisma.comment.create({
            data: {
                projectId,
                userId,
                content,
                position
            },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });
        // Notify all users in project via Socket
        SocketService.emitToProject(projectId, 'comment-added', comment);
        return comment;
    }
    static async getProjectComments(projectId) {
        return prisma.comment.findMany({
            where: { projectId },
            include: {
                user: { select: { name: true, avatar: true } }
            },
            orderBy: { createdAt: 'asc' }
        });
    }
}
