/**
 * Structured Logging Utility
 * Provides consistent logging across the application
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogContext {
  userId?: string;
  orderId?: string;
  productId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service?: string;
  environment?: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration: number;
    endpoint: string;
    method: string;
  };
}

class Logger {
  private serviceName: string;
  private environment: string;
  private minLevel: LogLevel;

  constructor() {
    this.serviceName = 'gyvagaudziaispastai-backend';
    this.environment = process.env.NODE_ENV || 'development';
    this.minLevel = this.getMinLevel();
  }

  private getMinLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    switch (level) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return this.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.minLevel);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    performance?: { duration: number; endpoint: string; method: string }
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: this.environment
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.environment !== 'production' ? error.stack : undefined
      };
    }

    if (performance) {
      entry.performance = performance;
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    // In production, output structured JSON
    // In development, output formatted text
    if (this.environment === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      const color = this.getColor(entry.level);
      const resetColor = '\x1b[0m';
      const timestamp = entry.timestamp.substring(11, 23);
      
      let output = `${color}[${timestamp}] ${entry.level.toUpperCase()}${resetColor} ${entry.message}`;
      
      if (entry.context) {
        output += ` ${JSON.stringify(entry.context)}`;
      }
      
      if (entry.error) {
        output += `\n  Error: ${entry.error.message}`;
        if (entry.error.stack) {
          output += `\n  Stack: ${entry.error.stack}`;
        }
      }
      
      if (entry.performance) {
        output += ` (${entry.performance.duration}ms)`;
      }
      
      console.log(output);
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return '\x1b[31m'; // Red
      case LogLevel.WARN: return '\x1b[33m';  // Yellow
      case LogLevel.INFO: return '\x1b[36m';  // Cyan
      case LogLevel.DEBUG: return '\x1b[37m'; // White
      default: return '\x1b[37m';
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.output(this.createLogEntry(LogLevel.ERROR, message, context, error));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.output(this.createLogEntry(LogLevel.WARN, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.output(this.createLogEntry(LogLevel.INFO, message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.output(this.createLogEntry(LogLevel.DEBUG, message, context));
    }
  }

  // Specialized logging methods
  apiRequest(method: string, endpoint: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${endpoint}`, {
      ...context,
      endpoint,
      method
    });
  }

  apiResponse(method: string, endpoint: string, statusCode: number, duration: number, context?: LogContext): void {
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    
    if (this.shouldLog(level)) {
      this.output(this.createLogEntry(
        level,
        `API Response: ${method} ${endpoint} - ${statusCode}`,
        context,
        undefined,
        { duration, endpoint, method }
      ));
    }
  }

  databaseQuery(query: string, duration: number, context?: LogContext): void {
    this.debug('Database Query', {
      ...context,
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration
    });
  }

  paymentEvent(event: string, amount: number, currency: string, orderId: string, context?: LogContext): void {
    this.info(`Payment Event: ${event}`, {
      ...context,
      event,
      amount,
      currency,
      orderId
    });
  }

  orderEvent(event: string, orderId: string, context?: LogContext): void {
    this.info(`Order Event: ${event}`, {
      ...context,
      event,
      orderId
    });
  }

  userEvent(event: string, userId: string, context?: LogContext): void {
    this.info(`User Event: ${event}`, {
      ...context,
      event,
      userId
    });
  }

  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): void {
    const level = severity === 'critical' ? LogLevel.ERROR : severity === 'high' ? LogLevel.WARN : LogLevel.INFO;
    
    if (this.shouldLog(level)) {
      this.output(this.createLogEntry(level, `Security Event: ${event}`, {
        ...context,
        event,
        severity,
        security: true
      }));
    }
  }

  performanceMetric(metric: string, value: number, unit: string, context?: LogContext): void {
    this.info(`Performance Metric: ${metric}`, {
      ...context,
      metric,
      value,
      unit,
      performance: true
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Convenience functions for common logging patterns
export const logApiRequest = (req: any) => {
  logger.apiRequest(req.method, req.url, {
    userId: req.user?.id,
    sessionId: req.session?.id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    traceId: req.headers['x-trace-id']
  });
};

export const logApiResponse = (req: any, res: any, duration: number) => {
  logger.apiResponse(req.method, req.url, res.statusCode, duration, {
    userId: req.user?.id,
    sessionId: req.session?.id,
    ipAddress: req.ip,
    traceId: req.headers['x-trace-id']
  });
};

export const logError = (error: Error, context?: LogContext) => {
  logger.error(error.message, context, error);
};

export const logPaymentEvent = (event: string, paymentData: any) => {
  logger.paymentEvent(event, paymentData.amount, paymentData.currency, paymentData.orderId, {
    paymentMethod: paymentData.paymentMethod,
    paymentId: paymentData.paymentId
  });
};

export const logOrderEvent = (event: string, order: any) => {
  logger.orderEvent(event, order.id, {
    customerId: order.customer_id,
    total: order.total,
    status: order.status
  });
};

export const logSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', req?: any) => {
  logger.securityEvent(event, severity, {
    ipAddress: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?.id,
    url: req?.url
  });
};