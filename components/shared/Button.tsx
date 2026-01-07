import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "danger":
        return "bg-danger";
      case "outline":
        return "bg-transparent border-2 border-primary";
      default:
        return "bg-primary";
    }
  };

  const getTextStyles = () => {
    return variant === "outline" ? "text-primary" : "text-white";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`py-4 px-6 rounded-xl ${getVariantStyles()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#4F46E5" : "#FFFFFF"}
        />
      ) : (
        <Text
          className={`text-center text-lg font-semibold ${getTextStyles()}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
