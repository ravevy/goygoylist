import { requireAuth } from "@/lib/requireAuth";

export default function Profile() {
  return <div>Profile</div>;
}

export const getServerSideProps = async () => {
  const auth = await requireAuth();
  if ("redirect" in auth) return auth;
};
