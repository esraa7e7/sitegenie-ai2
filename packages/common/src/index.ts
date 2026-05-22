import { diag, DiagLogLevel, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';

const DEFAULT_TRACER_NAME = 'sitegenie.common';
const DEFAULT_TRACER_VERSION = '1.0.0';

export const initTracing = (serviceName = 'sitegenie') => {
  diag.setLogger(
    {
      debug: console.debug.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console)
    },
    DiagLogLevel.INFO
  );

  return trace.getTracer(serviceName, DEFAULT_TRACER_VERSION);
};

export const getTracer = (serviceName = DEFAULT_TRACER_NAME) => {
  return trace.getTracer(serviceName, DEFAULT_TRACER_VERSION);
};

export const runInSpan = async <T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, unknown> = {}
): Promise<T> => {
  return getTracer().startActiveSpan(
    name,
    {
      kind: SpanKind.INTERNAL,
      attributes
    },
    async span => {
      try {
        const result = await fn();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error: unknown) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error)?.message || String(error) });
        throw error;
      } finally {
        span.end();
      }
    }
  );
};

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    diag.info(message);
    console.info(message, meta ?? '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    diag.warn(message);
    console.warn(message, meta ?? '');
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    diag.error(message);
    console.error(message, meta ?? '');
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    diag.debug(message);
    console.debug(message, meta ?? '');
  }
};
