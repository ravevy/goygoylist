import ProtectedRoute from "@/components/protected-route";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Dashboard</div>
    </ProtectedRoute>
  );
}
