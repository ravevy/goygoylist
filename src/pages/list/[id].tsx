import ProtectedRoute from "@/components/protected-route";
import { useRouter } from "next/router";

export default function ListDetail() {
  const { query } = useRouter();
  return (
    <ProtectedRoute>
      <div>List Detail: {query.id}</div>
    </ProtectedRoute>
  );
}
