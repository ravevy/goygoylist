import { supabase } from "./supabaseClient";

export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { session };
}
