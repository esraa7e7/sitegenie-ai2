// @ts-ignore
import * as Sentry from "@sentry/node";
// @ts-ignore
import { PostHog } from 'posthog-node';
export class ObservabilityService {
    static init() {
        if (process.env.SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV || 'development',
                tracesSampleRate: 1.0,
            });
            console.log("[Observability] Sentry Initialized");
        }
        console.log("[Observability] PostHog Initialized");
    }
    static trackEvent(userId, event, properties = {}) {
        this.posthog.capture({
            distinctId: userId,
            event,
            properties: {
                ...properties,
                $set: { email: properties.email }
            }
        });
    }
    static logError(error, context = {}) {
        console.error(`[Error] ${error.message}`, context);
        Sentry.withScope((scope) => {
            scope.setExtras(context);
            Sentry.captureException(error);
        });
    }
    static async shutdown() {
        await this.posthog.shutdown();
    }
}
Object.defineProperty(ObservabilityService, "posthog", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PostHog(process.env.POSTHOG_API_KEY || '', {
        host: 'https://app.posthog.com',
    })
});
