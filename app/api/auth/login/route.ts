import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

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

    // Find user and include password for comparison
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Validate role access
    if (roleType === 'practitioner' && !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Practitioner role required.' },
        { status: 403 }
      );
    }

    if (roleType === 'client' && user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Access denied. Client role required.' },
        { status: 403 }
      );
    }

    // Return plain object without Mongoose properties
    const userResponse = {
      id: user._id.toString(),
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
