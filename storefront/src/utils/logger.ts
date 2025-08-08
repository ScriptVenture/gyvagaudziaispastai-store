/**
 * Frontend Structured Logging Utility
 * Provides consistent client-side logging
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  page?: string;
  component?: string;
  action?: string;
  productId?: string;
  cartId?: string;
  orderId?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration: number;
    endpoint?: string;
    component?: string;
  };
  userAgent?: string;
  url?: string;
}

class FrontendLogger {
  private serviceName: string;
  private environment: string;
  private minLevel: LogLevel;
  private logBuffer: LogEntry[] = [];
  private bufferSize: number = 100;
  private batchSize: number = 10;

  constructor() {
    this.serviceName = 'gyvagaudziaispastai-storefront';
    this.environment = process.env.NODE_ENV || 'development';
    this.minLevel = this.getMinLevel();
    
    // Setup periodic log flushing
    if (typeof window !== 'undefined') {
      setInterval(() => this.flushLogs(), 30000); // Flush every 30 seconds
      window.addEventListener('beforeunload', () => this.flushLogs());
    }
  }

  private getMinLevel(): LogLevel {
    const level = process.env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase();
    switch (level) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return this.environment === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
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
    performance?: { duration: number; endpoint?: string; component?: string }
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: this.environment
    };

    // Add browser context
    if (typeof window !== 'undefined') {
      entry.url = window.location.href;
      entry.userAgent = navigator.userAgent;
    }

    if (context) {
      entry.context = {
        ...context,
        // Add automatic context
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        sessionId: this.getSessionId()
      };
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

  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return undefined;
  }

  private output(entry: LogEntry): void {
    // Always output to console for debugging
    if (this.environment !== 'production') {
      const color = this.getColor(entry.level);
      const resetColor = '\x1b[0m';
      const timestamp = entry.timestamp.substring(11, 23);
      
      let output = `${color}[${timestamp}] ${entry.level.toUpperCase()}${resetColor} ${entry.message}`;
      
      if (entry.context) {
        output += ` ${JSON.stringify(entry.context)}`;
      }
      
      if (entry.error) {
        output += `\n  Error: ${entry.error.message}`;
      }
      
      console.log(output);
    }

    // Add to buffer for remote logging
    this.logBuffer.push(entry);
    
    // Flush if buffer is full
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushLogs();
    }

    // For critical errors, flush immediately
    if (entry.level === LogLevel.ERROR) {
      this.flushLogs();
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

  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    // Take a batch of logs
    const batch = this.logBuffer.splice(0, this.batchSize);
    
    try {
      // Send logs to backend endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: batch })
      });
    } catch (error) {
      // If remote logging fails, fall back to console
      if (this.environment !== 'production') {
        console.warn('Failed to send logs to server:', error);
      }
      
      // Re-add failed logs to buffer (but limit to prevent infinite growth)
      if (this.logBuffer.length < this.bufferSize) {
        this.logBuffer.unshift(...batch);
      }
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

  // Specialized logging methods for e-commerce events
  pageView(page: string, context?: LogContext): void {
    this.info(`Page View: ${page}`, {
      ...context,
      page,
      action: 'page_view'
    });
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      action
    });
  }

  productView(productId: string, productName?: string, context?: LogContext): void {
    this.info('Product View', {
      ...context,
      productId,
      productName,
      action: 'product_view'
    });
  }

  addToCart(productId: string, quantity: number, price: number, context?: LogContext): void {
    this.info('Add to Cart', {
      ...context,
      productId,
      quantity,
      price,
      action: 'add_to_cart'
    });
  }

  removeFromCart(productId: string, context?: LogContext): void {
    this.info('Remove from Cart', {
      ...context,
      productId,
      action: 'remove_from_cart'
    });
  }

  checkoutStarted(cartValue: number, itemCount: number, context?: LogContext): void {
    this.info('Checkout Started', {
      ...context,
      cartValue,
      itemCount,
      action: 'checkout_started'
    });
  }

  orderCompleted(orderId: string, total: number, itemCount: number, context?: LogContext): void {
    this.info('Order Completed', {
      ...context,
      orderId,
      total,
      itemCount,
      action: 'order_completed'
    });
  }

  apiRequest(endpoint: string, method: string, context?: LogContext): void {
    this.debug(`API Request: ${method} ${endpoint}`, {
      ...context,
      endpoint,
      method,
      action: 'api_request'
    });
  }

  apiResponse(endpoint: string, method: string, status: number, duration: number, context?: LogContext): void {
    const level = status >= 500 ? LogLevel.ERROR : status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    
    if (this.shouldLog(level)) {
      this.output(this.createLogEntry(
        level,
        `API Response: ${method} ${endpoint} - ${status}`,
        {
          ...context,
          endpoint,
          method,
          status,
          action: 'api_response'
        },
        undefined,
        { duration, endpoint }
      ));
    }
  }

  performanceMetric(metric: string, value: number, component?: string, context?: LogContext): void {
    this.debug(`Performance: ${metric}`, {
      ...context,
      metric,
      value,
      component,
      action: 'performance_metric'
    });
  }

  jsError(error: Error, context?: LogContext): void {
    this.error(`JavaScript Error: ${error.message}`, {
      ...context,
      action: 'js_error'
    }, error);
  }
}

// Create singleton instance
const logger = new FrontendLogger();

export default logger;

// React hook for logging
export const useLogger = () => {
  return {
    logPageView: (page: string) => logger.pageView(page),
    logUserAction: (action: string, context?: LogContext) => logger.userAction(action, context),
    logProductView: (productId: string, productName?: string) => logger.productView(productId, productName),
    logAddToCart: (productId: string, quantity: number, price: number) => 
      logger.addToCart(productId, quantity, price),
    logCheckoutStarted: (cartValue: number, itemCount: number) => 
      logger.checkoutStarted(cartValue, itemCount),
    logOrderCompleted: (orderId: string, total: number, itemCount: number) => 
      logger.orderCompleted(orderId, total, itemCount),
    logError: (error: Error, context?: LogContext) => logger.jsError(error, context),
    logPerformance: (metric: string, value: number, component?: string) => 
      logger.performanceMetric(metric, value, component)
  };
};

// Global error handler setup
export const setupGlobalErrorHandler = () => {
  if (typeof window !== 'undefined') {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      logger.jsError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.jsError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });

    // Performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure') {
              logger.performanceMetric(entry.name, entry.duration);
            }
          });
        });
        observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        // Performance Observer not fully supported
      }
    }
  }
};