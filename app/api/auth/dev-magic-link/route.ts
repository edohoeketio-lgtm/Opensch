import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: email,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Direct the browser to the generated magic link to immediately log in
  return NextResponse.redirect(data.properties.action_link);
}
