import { ButtonProps } from "@/types/button";

export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 bg-gray-200 rounded font-medium  ${
        className ?? ""
      }`}
    >
      {label}
    </button>
  );
}
