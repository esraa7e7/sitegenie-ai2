import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketService {
  private static io: Server;
  private static users = new Map<string, { userId: string, userName: string, cursor?: any }>();

  static init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-project', (data: { projectId: string, userId: string, userName: string }) => {
        socket.join(`project:${data.projectId}`);
        this.users.set(socket.id, { userId: data.userId, userName: data.userName });
        
        // Broadcast presence
        this.broadcastPresence(data.projectId);
      });

      socket.on('cursor-move', (data: { projectId: string, cursor: any }) => {
        const user = this.users.get(socket.id);
        if (user) {
          user.cursor = data.cursor;
          socket.to(`project:${data.projectId}`).emit('user-cursor-moved', {
            socketId: socket.id,
            userId: user.userId,
            cursor: data.cursor
          });
        }
      });

      socket.on('file-update', (data: { projectId: string, path: string, content: string }) => {
        // In a real CRDT system, we'd handle changes better, but for this demo, 
        // we'll broadcast the update to all other users in the project.
        socket.to(`project:${data.projectId}`).emit('file-updated', data);
      });

      socket.on('disconnect', () => {
        const user = this.users.get(socket.id);
        if (user) {
          this.users.delete(socket.id);
          // We need to know which project they were in
          // For simplicity, we'll scan or use rooms
          socket.rooms.forEach(room => {
            if (room.startsWith('project:')) {
              this.broadcastPresence(room.split(':')[1]);
            }
          });
        }
      });
    });
  }

  private static broadcastPresence(projectId: string) {
    const room = `project:${projectId}`;
    const clients = this.io.sockets.adapter.rooms.get(room);
    const presenceList: any[] = [];
    
    if (clients) {
      clients.forEach(clientId => {
        const user = this.users.get(clientId);
        if (user) presenceList.push({ socketId: clientId, ...user });
      });
    }

    this.io.to(room).emit('presence-update', presenceList);
  }

  static emitToProject(projectId: string, event: string, data: any) {
    this.io.to(`project:${projectId}`).emit(event, data);
  }
}
