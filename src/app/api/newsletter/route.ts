import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status !== 'ACTIVE') {
        // Reactivate
        await prisma.newsletterSubscription.update({
          where: { email: cleanEmail },
          data: { status: 'ACTIVE' },
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
      });
    }

    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: cleanEmail,
        source: source || 'footer',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the Mighty Warner newsletter!',
      data: subscription,
    });
  } catch (error: any) {
    console.error('Error creating newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription', details: error.message },
      { status: 500 }
    );
  }
}

