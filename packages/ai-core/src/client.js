export class SiteGenieClient {
    constructor(baseUrl, token) {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseUrl = baseUrl;
        this.token = token;
    }
    async solve(prompt, userAppId) {
        const response = await fetch(`${this.baseUrl}/functions/v1/orchestrator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ prompt, userAppId })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Backend request failed');
        }
        return response.json();
    }
}
