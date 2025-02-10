import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="root">
            <Sidebar />
            <MobileNav />

            <div className="root-container">
                <div className="wrapper">
                    {children}
                </div>
            </div>

            Toaster
        </main>
    );
}

