export interface BackendRequest {
    prompt: string;
    userAppId: string;
}
export declare class SiteGenieClient {
    private baseUrl;
    private token;
    constructor(baseUrl: string, token: string);
    solve(prompt: string, userAppId: string): Promise<any>;
}
//# sourceMappingURL=client.d.ts.map