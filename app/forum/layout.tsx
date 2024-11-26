import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-4xl py-8 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
