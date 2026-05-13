export interface BackendRequest {
  prompt: string;
  userAppId: string;
}

export class SiteGenieClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async solve(prompt: string, userAppId: string) {
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
