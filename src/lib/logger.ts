/**
 * Centralized Sanctuary Logging Utility
 * Standardizes security and error visibility for the Hapiimood application.
 */

type LogLevel = "info" | "warn" | "error" | "security";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: Record<string, unknown>) => {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    // Standard console logging for standard environments
    const logFn = level === "error" || level === "security" ? console.error : console.log;
    
    logFn(
      `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
      context ? JSON.stringify(context, null, 2) : ""
    );

    // In a production environment, this is where you'd send logs to
    // a service like Datadog, Axiom, or Sentry.
    if (process.env.NODE_ENV === "production") {
      // TODO: Integration with production monitoring service
    }
  },

  info: (message: string, context?: Record<string, unknown>) => logger.log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => logger.log("error", message, context),
  security: (message: string, context?: Record<string, unknown>) => logger.log("security", message, context),
};
