import { Header } from "./header";
import { Footer } from "./footer";
import { BottomTabBar } from "./bottom-tab-bar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomTabBar />
    </div>
  );
}
