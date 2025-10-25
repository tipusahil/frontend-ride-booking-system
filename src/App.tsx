import { Outlet } from "react-router"
import CommonLayout from "./components/layouts/commonLayout/CommonLayout"
import "@/index.css"; // বা যেই path তুমি ব্যবহার করছো

function App() {
  return (
    <div className="flex min-h-svh  max-w-svw flex-col items-center justify-center">
     
      <div className="border-2 border-red-500 h-full w-full">
       <CommonLayout>
         <Outlet/>
       </CommonLayout>
      </div>
   
    </div>
  )
}

export default App