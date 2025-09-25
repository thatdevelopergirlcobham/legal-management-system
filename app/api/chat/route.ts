import { NextResponse } from 'next/server';
import { createChatMessage, getChatMessagesBetweenUsers, findUserById } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const { recipientId, content } = await request.json();

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For now, we'll use a simple approach - assuming the sender is a valid user
    // In a real app, you'd get this from authentication
    const senderId = 'client-001'; // Default sender for demo purposes

    // Verify recipient exists
    const recipient = await findUserById(recipientId);
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const newMessage = await createChatMessage({
      sender: senderId,
      recipient: recipientId,
      content,
      timestamp: new Date(),
      read: false
    });

    return NextResponse.json(newMessage);
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // For now, we'll use a simple approach - assuming the current user is a valid user
    // In a real app, you'd get this from authentication
    const currentUserId = 'client-001'; // Default user for demo purposes

    const messages = await getChatMessagesBetweenUsers(currentUserId, otherUserId);

    return NextResponse.json(messages);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
