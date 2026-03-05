import ProtectedRoute from "@/components/protected-route";

export default function Profile() {
  return (
    <ProtectedRoute>
      <div>Profile</div>
    </ProtectedRoute>
  );
}
