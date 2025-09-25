import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/mockData';

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, roleType } = body;

    // Validate required fields
    if (!email || !password || !roleType) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, roleType' },
        { status: 400 }
      );
    }

    // Validate roleType
    if (!['practitioner', 'client'].includes(roleType)) {
      return NextResponse.json(
        { error: 'Invalid roleType. Must be practitioner or client' },
        { status: 400 }
      );
    }

    // Map roleType to expected role
    const expectedRole = roleType === 'practitioner' ? 'STAFF' : 'CLIENT';

    // Find user and validate credentials
    const user = await findUserByEmail(email, password, expectedRole);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
