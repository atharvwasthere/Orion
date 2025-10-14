import type { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware for observability
 * Logs: method, route, status, latency, companyId, sessionId
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Extract companyId and sessionId from params if available
  const { companyId, sessionId } = req.params;

  // Capture the original res.json to log after response
  const originalJson = res.json.bind(res);
  
  res.json = function (body: any) {
    const latency = Date.now() - startTime;
    
    // Log request details
    const logData: any = {
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.route?.path || req.path,
      fullPath: req.originalUrl || req.url,
      status: res.statusCode,
      latency: `${latency}ms`,
    };

    // Add identifiers if present
    if (companyId) logData.companyId = companyId;
    if (sessionId) logData.sessionId = sessionId;

    // Add user agent for debugging
    if (req.headers['user-agent']) {
      logData.userAgent = req.headers['user-agent'];
    }

    // Log based on status code
    if (res.statusCode >= 500) {
      console.error('❌ Request Error:', logData);
    } else if (res.statusCode >= 400) {
      console.warn('⚠️  Client Error:', logData);
    } else if (latency > 3000) {
      console.warn('🐢 Slow Request:', logData);
    } else {
      console.log('✅ Request:', logData);
    }

    // Call original json method
    return originalJson(body);
  };

  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const { companyId, sessionId } = req.params;

  console.error('💥 Application Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    route: req.route?.path || req.path,
    fullPath: req.originalUrl || req.url,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    ...(companyId && { companyId }),
    ...(sessionId && { sessionId }),
  });

  // Pass error to next error handler
  next(err);
}