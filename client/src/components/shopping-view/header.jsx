/* eslint-disable no-unused-vars */
import {LogOut, Menu, ShoppingCart, UserCheck, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import logo from "../../assets/vv_logo.jpg";
import { Label } from "../ui/label";

// MenuItems component
function MenuItems({ setOpenSheet, activePath }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }

    if (setOpenSheet) setOpenSheet(false);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-medium cursor-pointer transition-colors duration-150 ${activePath === menuItem.path ? "font-bold text-foreground" : "text-muted-foreground"
            }`}
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// HeaderRightContent component (no cart state here)
function HeaderRightContent({ onCartClick, onCloseMenu }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    if (onCloseMenu) onCloseMenu();
  }

  const handleUserAvatarClick = () => {
    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user?.id, isAuthenticated]);

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          if (!isAuthenticated) {
            navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
          }
          onCartClick();
          if (onCloseMenu) onCloseMenu();
        }}
        variant="outline"
        size="icon"
        className="cursor-pointer relative animate-bounce"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
          {isAuthenticated ? (cartItems?.items?.length || "0") : "0"}
        </span>
      </Button>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black cursor-pointer">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate("/shop/account");
                if (onCloseMenu) onCloseMenu();
              }}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleUserAvatarClick}
          className="cursor-pointer"
        >
          Login/Register
        </Button>
      )}
    </div>
  );
}

// ShoppingHeader component (single source of cart state)
function ShoppingHeader() {
  const [openSheet, setOpenSheet] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <span className="font-bold">VESTRA VERSA</span>
          <img
            src={logo}
            alt=""
            className="h-12 w-12 ml-2 object-contain rounded-full"
          />
        </Link>

        {/* Mobile Menu Sheet */}
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-4 space-y-4">
            <div className="flex gap-4">
              <HeaderRightContent
                onCartClick={() => setOpenCartSheet(true)}
                onCloseMenu={() => setOpenSheet(false)}
              />
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 animate-pulse"
              onClick={() => {
                navigate("/shop/search");
                setOpenSheet(false);
              }}
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Button>
            <MenuItems setOpenSheet={setOpenSheet} activePath={location.pathname} />
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <MenuItems activePath={location.pathname} />
          <Button
            variant="ghost"
            className="flex items-center gap-2 animate-pulse"
            onClick={() => navigate("/shop/search")}
          >
            <Search className="h-5 w-5" />
          </Button>
          <HeaderRightContent onCartClick={() => setOpenCartSheet(true)} />
        </div>
      </div>

      {/* Cart Sheet - only one instance */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;