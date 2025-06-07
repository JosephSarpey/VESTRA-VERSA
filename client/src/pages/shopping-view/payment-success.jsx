import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  // Track screen size for Confetti
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative overflow-hidden">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={300}
      />

      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl text-center z-10">
        <CardHeader className="flex flex-col items-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-pulse" />
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <Button
            className="w-full"
            onClick={() => navigate("/shop/account")}
          >
            View My Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
