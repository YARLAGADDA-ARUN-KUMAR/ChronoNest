import { AlertCircle } from "lucide-react";

export default function ErrorDisplay({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md flex items-center space-x-2">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
}
