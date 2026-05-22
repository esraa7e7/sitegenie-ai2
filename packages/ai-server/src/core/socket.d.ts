import { Server as HttpServer } from 'http';
export declare class SocketService {
    private static io;
    private static users;
    static init(server: HttpServer): void;
    private static broadcastPresence;
    static emitToProject(projectId: string, event: string, data: any): void;
}
//# sourceMappingURL=socket.d.ts.map