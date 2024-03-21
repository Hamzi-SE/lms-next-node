"use client";

import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "./Provider";
import { SessionProvider } from "next-auth/react";
import Loader from "@/app/components/Loader/Loader";

import "./globals.css";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Josefin",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body
                className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
            >
                <ReduxProvider>
                    <SessionProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            <Custom>{children}</Custom>
                            <Toaster position="top-center" reverseOrder={false} />
                        </ThemeProvider>
                    </SessionProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useLoadUserQuery({});
    return <>{isLoading ? <Loader /> : children}</>;
};
