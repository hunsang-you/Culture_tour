import { ButtonProps } from "@/types/button";

export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 bg-gray-200 rounded ${className ?? ""}`}
    >
      {label}
    </button>
  );
}
