import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}