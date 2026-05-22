import { Server } from 'socket.io';
export class SocketService {
    static init(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
            }
        });
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            socket.on('join-project', (data) => {
                socket.join(`project:${data.projectId}`);
                this.users.set(socket.id, { userId: data.userId, userName: data.userName });
                // Broadcast presence
                this.broadcastPresence(data.projectId);
            });
            socket.on('cursor-move', (data) => {
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
            socket.on('file-update', (data) => {
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
    static broadcastPresence(projectId) {
        const room = `project:${projectId}`;
        const clients = this.io.sockets.adapter.rooms.get(room);
        const presenceList = [];
        if (clients) {
            clients.forEach(clientId => {
                const user = this.users.get(clientId);
                if (user)
                    presenceList.push({ socketId: clientId, ...user });
            });
        }
        this.io.to(room).emit('presence-update', presenceList);
    }
    static emitToProject(projectId, event, data) {
        this.io.to(`project:${projectId}`).emit(event, data);
    }
}
Object.defineProperty(SocketService, "users", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
