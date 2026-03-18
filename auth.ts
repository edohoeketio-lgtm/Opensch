// Mock Auth implementation to satisfy the IDOR fix in the telemetry endpoint
// until true NextAuth (Auth.js) is implemented.
export async function auth() {
  return {
    user: {
      id: "fallback-student-uuid",
      email: "student@opensch.edu",
      role: "STUDENT"
    }
  };
}
