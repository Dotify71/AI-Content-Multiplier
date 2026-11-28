import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

const VALID_TIERS = ['basic', 'pro', 'unlimited'] as const;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !VALID_TIERS.includes(tier)) {
      return NextResponse.json({ error: 'Invalid verification payload or tier' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server payment configuration missing' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time comparison prevents cryptographic timing attacks
    const sigA = Buffer.from(generated_signature, 'utf8');
    const sigB = Buffer.from(razorpay_signature, 'utf8');
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return NextResponse.json({ error: 'Payment signature mismatch' }, { status: 400 });
    }

    // Update user tier securely in profile
    const { error } = await supabase.from('profiles').update({ tier }).eq('id', user.id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
