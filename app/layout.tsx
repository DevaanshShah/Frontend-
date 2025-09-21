import "./globals.css";
import Navbar from "../components/shared/Navbar";

export const metadata = {
  title: "Robot Bobby Earth",
  description: "Scroll-driven 3D Earth with React Three Fiber",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased relative overflow-x-hidden">
        {/* Global animated background layer */}
        <div
          aria-hidden
          className="fixed inset-0 z-0 pointer-events-none animated-aurora animate-slow-pan opacity-50"
        />

        {/* App content */}
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
