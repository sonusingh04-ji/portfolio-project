import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-white text-slate-950">

            {/* Global public navbar */}
            <div className="sticky top-0 z-50 px-4 pt-4">
                <Navbar />
            </div>

            {/* Every public page renders here */}
            <main className="relative">
                <Outlet />
            </main>

            {/* Global footer */}
            <Footer />

        </div>
    );
};

export default PublicLayout;