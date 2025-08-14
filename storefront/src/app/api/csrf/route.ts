import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Store CSRF tokens in memory (in production, use Redis or similar)
// This is a simple implementation for demonstration
const csrfTokens = new Map<string, { token: string; timestamp: number }>();

// Clean up old tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of csrfTokens.entries()) {
    // Remove tokens older than 1 hour
    if (now - value.timestamp > 3600000) {
      csrfTokens.delete(key);
    }
  }
}, 3600000); // Run every hour

export async function GET(request: NextRequest) {
  try {
    // Generate a new CSRF token
    const token = crypto.randomBytes(32).toString('hex');
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    // Store token with timestamp
    csrfTokens.set(sessionId, {
      token,
      timestamp: Date.now()
    });
    
    // Create response with token
    const response = NextResponse.json({
      csrfToken: token,
      sessionId: sessionId
    });
    
    // Set secure cookie with session ID
    response.cookies.set('csrf-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csrfToken } = body;
    
    // Get session ID from cookie
    const sessionId = request.cookies.get('csrf-session')?.value;
    
    if (!sessionId || !csrfToken) {
      return NextResponse.json(
        { valid: false, error: 'Missing CSRF token or session' },
        { status: 400 }
      );
    }
    
    // Verify token
    const storedData = csrfTokens.get(sessionId);
    
    if (!storedData) {
      return NextResponse.json(
        { valid: false, error: 'Invalid session' },
        { status: 403 }
      );
    }
    
    // Check if token matches and is not expired (1 hour)
    const isValid = storedData.token === csrfToken && 
                    (Date.now() - storedData.timestamp) < 3600000;
    
    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired CSRF token' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('CSRF validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'CSRF validation failed' },
      { status: 500 }
    );
  }
}
