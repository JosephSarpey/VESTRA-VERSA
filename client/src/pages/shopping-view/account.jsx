import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logo from "../../assets/vv_logo.jpg";
import Address from "./address";
import ShoppingOrders from "@/components/shopping-view/orders";
import Footer from "./footer";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[450px] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-amber-700 flex items-center justify-center overflow-hidden">
        <div className="p-8 bg-white/10 backdrop-blur-sm rounded-full border-4 border-amber-500/30 shadow-2xl">
          <img
            src={logo}
            className="h-64 w-64 rounded-full object-cover shadow-lg border-4 border-amber-500/50"
            alt="Vestra Versa Logo"
          />
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 -mt-16 relative z-10">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg border-amber-100">
          <Tabs defaultValue="orders">
            <TabsList className="bg-amber-50">
              <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Orders
              </TabsTrigger>
              <TabsTrigger value="address" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders/>
            </TabsContent>
            <TabsContent value="address">
              <Address/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShoppingAccount;
