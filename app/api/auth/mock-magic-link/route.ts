import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const redirectTo = url.searchParams.get("redirect") || "/dashboard";

  if (!email) {
    return new Response("Missing email parameter", { status: 400 });
  }

  // Upsert the mock user for seamless local development
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'INSTRUCTOR', isAdmin: true },
    create: {
      email,
      role: 'INSTRUCTOR',
      isAdmin: true
    }
  });

  // Set the mock session cookie
  const cookieStore = await cookies();
  cookieStore.set("opensch_mock_email", email, {
    path: "/",
    httpOnly: true, // Secure in a real app
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  // Redirect to the onboarding or dashboard
  redirect(redirectTo);
}
