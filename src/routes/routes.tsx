
import App from "@/App";
import About from "@/pages/About";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router";

const router =  createBrowserRouter([
    {
    //  element: <App/>,
     Component: App,
     path:"/",
     children: [
        {
            Component:About,
            path:"about"
        }
     ]
    },
    {
        Component:LoginPage,
        path:"/login"
    },
    {
        Component:RegisterPage,
        path:"/register"
    }

])

export default router;