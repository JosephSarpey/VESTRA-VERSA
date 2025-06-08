import { ClipLoader } from "react-spinners";

function Loading({ message = "Loading...", size = 40 }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px]">
      <ClipLoader color="#6366f1" size={size} />
      <span className="mt-4 text-lg text-gray-600 animate-pulse">{message}</span>
    </div>
  );
}

export default Loading;