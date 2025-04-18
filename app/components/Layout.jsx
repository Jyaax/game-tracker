import { Navbar } from "./Navbar";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-background border-t py-4">
        <div className="w-full max-w-[1400px] mx-auto px-4 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Game Tracker by Julie L. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
