"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { Role } from "@prisma/client";

/**
 * Initializes a secure Paystack transaction link for an Accepted candidate.
 */
export async function createPaystackSession(applicationId: string, amountKobo: number = 5000000) { // e.g., 50k NGN
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.INSTRUCTOR)) {
    throw new Error("Unauthorized to generate billing links.");
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId }
  });

  if (!application) {
    throw new Error("Application record not found.");
  }

  // Fallback to internal env locally or require production key
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "sk_test_placeholder_key_for_dev";

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: application.email,
      amount: amountKobo, 
      metadata: {
        application_id: application.id
      },
      // When paid, redirect them smoothly into the platform welcome setup
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding?source=paystack`
    })
  });

  const parsed = await response.json();

  if (!parsed.status) {
    throw new Error(`Paystack Init Error: ${parsed.message}`);
  }

  // Persist the Paystack reference explicitly for Webhook reconciliation
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      paystackRef: parsed.data.reference
    }
  });

  return {
    authorizationUrl: parsed.data.authorization_url,
    reference: parsed.data.reference
  };
}
