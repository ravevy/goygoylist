import { useRouter } from "next/router";

export default function ListDetail() {
  const { query } = useRouter();
  return <div>List Detail: {query.id}</div>;
}
