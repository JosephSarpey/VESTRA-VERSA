import ShoppingHeader from "@/components/shopping-view/header";
import { Outlet } from "react-router-dom";


function ShoppingLayout() {
  return (
  <div className="flex flex-col bg-white overflow-hidden">
    {/* Common Header Component for Shopping Layout */}
    <ShoppingHeader/>
    <main className="flex flex-col w-full">
        <Outlet />
    </main>
  </div>
  );
}

export default ShoppingLayout;
