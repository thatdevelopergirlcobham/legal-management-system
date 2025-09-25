import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipientId, content } = await request.json();
  
  await connectToDatabase();
  
  try {
    const newMessage = new ChatMessage({
      sender: session.user.id,
      recipient: recipientId,
      content
    });
    
    await newMessage.save();
    
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const otherUserId = searchParams.get('userId');
  
  await connectToDatabase();
  
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: session.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: session.user.id }
      ]
    }).sort({ timestamp: 1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
