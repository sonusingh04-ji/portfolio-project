import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="min-w-0 flex-1">
                {children}
            </div>

        </div>
    );
};

export default AdminLayout;