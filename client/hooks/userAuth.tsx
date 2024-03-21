import { useAppSelector } from "@/redux/store";

export default function userAuth() {
    const { user } = useAppSelector((state) => state.auth);

    if (user) {
        return true;
    } else {
        return false;
    }
}
