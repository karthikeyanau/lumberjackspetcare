import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
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

export async function GET(request) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscriptions = await Subscription.find({ userId })
      .populate('petProfileId')
      .populate('products.productId');
    
    return NextResponse.json({ subscriptions });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Calculate next delivery date
    const nextDelivery = new Date();
    if (data.frequency === 'monthly') {
      nextDelivery.setMonth(nextDelivery.getMonth() + 1);
    } else if (data.frequency === 'bi-monthly') {
      nextDelivery.setMonth(nextDelivery.getMonth() + 2);
    } else if (data.frequency === 'quarterly') {
      nextDelivery.setMonth(nextDelivery.getMonth() + 3);
    }

    const subscription = await Subscription.create({
      ...data,
      userId,
      nextDeliveryDate: nextDelivery,
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

