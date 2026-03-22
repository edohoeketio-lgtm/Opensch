import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && serviceRoleKey) {
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const email = 'endersdsg@gmail.com';
  console.log(`Testing inviteUserByEmail for ${email}...`);
  
  supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://opensch.vercel.app/welcome'
  }).then(({ data, error }) => {
    if (error) {
      console.error('SUPABASE EXACT ERROR:', error);
    } else {
      console.log('SUCCESS:', data);
    }
  }).catch(err => console.error('CATCH ERROR:', err));
} else {
  console.error("Missing ENV vars");
}
