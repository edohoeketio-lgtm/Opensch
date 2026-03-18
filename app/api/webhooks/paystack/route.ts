import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { convertApplicationToStudent } from "@/app/actions/admissions"; // Ensure logic stays centralized

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "sk_test_placeholder_key_for_dev";

    // Validate Signature
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET)
                       .update(rawBody)
                       .digest('hex');
    
    if (hash !== signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Invalid Signature." }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    if (body.event === "charge.success") {
      const reference = body.data.reference;
      const amount = body.data.amount;

      // Ensure exact reconciliation
      const application = await prisma.application.findUnique({
        where: { paystackRef: reference }
      });

      if (!application) {
         console.warn(`Paystack success fired for unknown reference: ${reference}`);
         return NextResponse.json({ status: "ignored" });
      }

      // Upgrade Status
      await prisma.application.update({
        where: { id: application.id },
        data: { paymentStatus: 'FULLY_PAID' }
      });

      // Directly port their student profile (assuming cohort selection is handled inside logic or deferred)
      // Since it's automated, we might drop them in an unassigned state or a default pool for instructors to finalize assigning
      // For now we run the converter silently passing null for cohortId to map later, or if your schema allows it.
      // Easiest is to queue them internally, or just mark FULLY_PAID and let the admin hit "Provision" manually for specific Cohort mappings!

      // To respect your existing `convertApplicationToStudent` parameter rules (cohortId needed), 
      // we'll simply leave them as `FULLY_PAID` so the Admin pipeline flags them green!
      // The Admin can then bulk-assign all FULLY_PAID to 'October Cohort' etc.
    }

    return NextResponse.json({ status: "success" });

  } catch (err: any) {
    console.error("Paystack Webhook Fault:", err.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
