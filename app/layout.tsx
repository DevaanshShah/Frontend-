import "./globals.css";

export const metadata = {
  title: "Robot Bobby Earth",
  description: "Scroll-driven 3D Earth with React Three Fiber",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
