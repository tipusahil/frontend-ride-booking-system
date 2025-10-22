import { Outlet } from "react-router";


const AdminLayout = () => {
    return (
        <div className="border-2 border-purple-400 m-6">
             <h2>from admin layout compo </h2>
             <Outlet/>
        </div>
    );
};

export default AdminLayout;