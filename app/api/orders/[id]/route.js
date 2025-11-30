import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserId(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = await Order.findById(id)
      .populate('items.productId')
      .populate('userId', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if the order belongs to the user
    // Handle both populated (object) and non-populated (ObjectId) userId
    let orderUserId;
    if (order.userId && typeof order.userId === 'object' && order.userId._id) {
      // Populated user object
      orderUserId = order.userId._id.toString();
    } else {
      // ObjectId or string
      orderUserId = order.userId?.toString() || order.userId;
    }
    
    if (orderUserId !== userId.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

