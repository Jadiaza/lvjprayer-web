import { cn } from "@/lib/utils";
import logoAsset from "@/assets/lvdj-logo.png.asset.json";

export const Logo = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const h = size === "lg" ? "h-16" : size === "sm" ? "h-9" : "h-12";
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src={logoAsset.url}
        alt="La Voz de Jesús"
        className={cn(h, "w-auto drop-shadow-[0_4px_18px_rgba(212,165,76,0.35)]")}
      />
    </div>
  );
};