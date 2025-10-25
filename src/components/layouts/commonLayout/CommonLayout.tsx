import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface IProps {
  children: ReactNode;
}

const CommonLayout = ({ children }: IProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always at top */}
      <Navbar />

      {/* Main grows to fill the space between Navbar and Footer */}
      <main className="flex-1 border-2 border-green-500">
        {children}
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default CommonLayout;
