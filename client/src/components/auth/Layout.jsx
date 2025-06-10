import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/vv_logo.jpg";
import MotionWrapper from "@/components/common/MotionWrapper";

function AuthLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Branding Panel - only visible on large screens */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black w-1/2 px-12">
        <div className="space-y-6 text-center text-white">
          <img
            src={logo}
            alt="Vestra Versa Logo"
            className="mx-auto w-32 h-32 rounded-full border-4 border-[#FFD700]"
          />
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome to <span className="text-[#FFD700]">VESTRA VERSA</span>
          </h1>
          <p className="text-sm text-gray-300">
            Your ultimate fashion hub for bold, modern, and versatile style.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-white via-[#fffdf5] to-[#fffcea] px-4 py-12 sm:px-6 lg:px-8">
        <MotionWrapper key={location.pathname}>
          <div className="w-full max-w-md bg-white/80 p-8 rounded-xl shadow-xl border border-[#FFD700]/20">
            {/* Small Screen Branding Header */}
            <div className="lg:hidden mb-6 text-center space-y-2">
              <img
                src={logo}
                alt="Vestra Versa Logo"
                className="mx-auto w-16 h-16 rounded-full border-2 border-[#FFD700]"
              />
              <h1 className="text-xl font-semibold text-[#000000]">
                <span className="text-[#FFD700] font-bold">VESTRA VERSA</span>
              </h1>
              <p className="text-sm text-gray-500">
                Fashion Hub – Login or Register Below
              </p>
            </div>

            {/* Render Login/Register Form */}
            <Outlet />
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}

export default AuthLayout;
