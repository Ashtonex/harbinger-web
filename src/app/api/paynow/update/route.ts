import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// FIX: Use fallback strings so the build doesn't crash if keys are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// We need the SERVICE ROLE KEY to update the database securely
// bypassing any RLS rules (since Paynow isn't a logged-in user)
const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey, 
  { 
    auth: { 
      persistSession: false, // Important: Don't persist sessions on the server
      autoRefreshToken: false,
      detectSessionInUrl: false
    } 
  }
);

export async function POST(request: Request) {
  try {
    // Paynow sends data as "Form Data", not JSON
    const formData = await request.formData();
    
    const reference = formData.get("reference")?.toString();
    const paynowRef = formData.get("paynowreference")?.toString();
    const amount = formData.get("amount");
    const status = formData.get("status")?.toString(); // "Paid", "Awaiting Delivery", "Cancelled"
    
    console.log(`🔔 Webhook Received: ${reference} | Status: ${status}`);

    if (!reference || !status) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Update the Database
    const { error } = await supabaseAdmin
      .from("transactions")
      .update({ 
        status: status,
        paynow_ref: paynowRef,
        updated_at: new Date().toISOString()
      })
      .eq("reference", reference);

    if (error) {
      console.error("Failed to update transaction:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // 2. (Optional) SEND EMAIL RECEIPT
    // If status === 'Paid', you would call your Email API here (e.g., Resend.com)
    if (status === 'Paid') {
       console.log("✅ Payment Confirmed. Sending receipt email...");
       // await sendEmail({ to: email, subject: "Tithe Receipt", ... })
    }

    // Paynow expects a pure "200 OK" response, no JSON needed really, but Next.js requires a return.
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}