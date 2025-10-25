import App from "@/App";
import DashboardLayout from "@/components/layouts/dashboardLayout/DashboardLayout";
import About from "@/pages/About";
import Analytics from "@/pages/admin/Analytics";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    //  element: <App/>,
    Component: App,
    path: "/",
    children: [
      {
        Component: HomePage,
        path: "/",
        index: true,
      },
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: LoginPage,
    path: "/login",
  },
  {
    Component: RegisterPage,
    path: "/register",
  },

  // -----DashboardLayout for aadmin----
  {
    Component: DashboardLayout,
    path: "/admin/dashboard",
    children: [
      {
        Component: Analytics,
        path: "analytics",
      },
    ],
  },
  // -----DashboardLayout for user----
  {
    Component: DashboardLayout,
    path: "/user/dashboard",
    children: [
      // {
      //     Component:rider,
      //     path:"/analytics"
      // }
    ],
  },
]);

export default router;
