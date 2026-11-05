import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const article = await prisma.insight.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error fetching insight by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insight', details: error.message },
      { status: 500 }
    );
  }
}

