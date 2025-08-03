import { useAppSelector } from "../hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return <p className="text-center mt-8">Redirecting to login...</p>;
  }

  return <>{children}</>;
}
