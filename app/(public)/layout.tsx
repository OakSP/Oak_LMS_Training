import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 70px)" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
