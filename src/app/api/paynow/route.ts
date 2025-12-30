import { NextResponse } from "next/server";
import { Paynow } from "paynow";
import { supabase } from "@/utils/supabase"; // Ensure this imports your client
// NOTE: For backend API routes, it is safer to use a Service Role client
// if you have RLS enabled, but for now standard client is okay if RLS allows inserts.
// Ideally, use createClient from @supabase/supabase-js with SERVICE_ROLE_KEY for admin writes.

export async function POST(request: Request) {
  try {
    const { email, amount, category } = await request.json();

    // 1. Generate Reference
    const reference = `${category}-${Date.now()}`;

    // 2. LOG TO DATABASE FIRST (Status: Initiated)
    // We use a direct Supabase call here.
    // If you have strict RLS, you might need the Service Key here.
    const { error: dbError } = await supabase
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

    paynow.resultUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/paynow/update`;
    paynow.returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/give/success`;

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