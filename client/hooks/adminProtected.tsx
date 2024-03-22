import { useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
    const { user } = useAppSelector((state) => state.auth);

    if (user) {
        const isAdmin = user?.role === "admin";
        return isAdmin ? children : redirect("/");
    }
}
