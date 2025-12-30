import { NextResponse } from "next/server";
// @ts-ignore
import { Paynow } from "paynow";
import { createClient } from "@supabase/supabase-js"; 

// Use the Service Role Key for backend writes to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { email, amount, category } = await request.json();

    // 1. Generate Reference
    const reference = `${category}-${Date.now()}`;

    // 2. LOG TO DATABASE FIRST (Status: Initiated)
    const { error: dbError } = await supabaseAdmin
      .from("transactions")
      .insert({
        reference,
        email,
        amount,
        category,
        status: "Initiated"
      });

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ success: false, error: "Database recording failed" }, { status: 500 });
    }

    // 3. Initialize Paynow
    const paynow = new Paynow(
      process.env.PAYNOW_INTEGRATION_ID,
      process.env.PAYNOW_INTEGRATION_KEY
    );

    // Ensure these URLs are set in your environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    paynow.resultUrl = `${baseUrl}/api/paynow/update`;
    paynow.returnUrl = `${baseUrl}/give/success`;

    const payment = paynow.createPayment(reference, email);
    payment.add(category, amount);

    const response = await paynow.send(payment);

    if (response.success) {
      return NextResponse.json({ 
        success: true, 
        url: response.redirectUrl, 
        pollUrl: response.pollUrl 
      });
    } else {
      return NextResponse.json({ success: false, error: "Paynow connection failed" }, { status: 500 });
    }

  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
