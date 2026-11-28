import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';

const TIER_AMOUNTS: Record<string, number> = {
  basic: 49900,     // ₹499 in paise
  pro: 99900,       // ₹999 in paise
  unlimited: 199900 // ₹1,999 in paise
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to upgrade' }, { status: 401 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway configuration is missing' }, { status: 500 });
    }

    const { tier } = await req.json();
    const amount = TIER_AMOUNTS[tier];

    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
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
    return NextResponse.json({ error: 'Failed to initialize payment order' }, { status: 500 });
  }
}
