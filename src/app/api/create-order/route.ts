import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await req.json();

    let amount = 0;
    if (tier === 'basic') amount = 49900; // 499 INR in paise
    if (tier === 'pro') amount = 99900;
    if (tier === 'unlimited') amount = 199900;

    if (amount === 0) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
