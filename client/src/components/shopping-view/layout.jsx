import { Outlet } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";
import { LayoutDashboard, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingHeader from "./header";
import FilterComponent from "./filter";

function ShoppingLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <ShoppingHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle button */}
        <Button
          variant="outline"
          size="icon"
          className={clsx(
            "fixed bottom-4 right-4 z-50 lg:hidden rounded-full h-12 w-12 shadow-lg"
          )}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
        </Button>

        {/* Sidebar */}
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 w-64 border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-shrink-0 overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full w-full">
            <div className="flex h-14 items-center border-b px-4 shrink-0">
              <LayoutDashboard className="h-5 w-5 mr-2 text-gray-500" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="p-4 overflow-y-auto">
              <FilterComponent />
            </div>
          </div>
        </aside>


        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Our Products</h1>
              <div className="hidden lg:block">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">12</span> of <span className="font-medium">48</span> products
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default ShoppingLayout;