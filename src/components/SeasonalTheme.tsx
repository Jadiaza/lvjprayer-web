import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPublicCollection, type LiturgicalTheme } from "@/lib/publicContent";

function hexToHslTokens(hex: string): string | null {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
  const channels = hex.slice(1).match(/.{2}/g)?.map((part) => parseInt(part, 16) / 255);
  if (!channels || channels.length !== 3) return null;
  const [r, g, b] = channels;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  const delta = max - min;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

export default function SeasonalTheme() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    let active = true;
    getPublicCollection<LiturgicalTheme>("theme").then((themes) => {
      if (!active || themes.length === 0) return;
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
      const theme = themes.find((item) => item.start_date <= today && item.end_date >= today);
      if (!theme) return;

      const root = document.documentElement;
      const primary = hexToHslTokens(theme.primary_color);
      const accent = hexToHslTokens(theme.accent_color);
      const background = hexToHslTokens(theme.background_color);
      if (primary) {
        root.style.setProperty("--primary", primary);
        root.style.setProperty("--ring", primary);
        root.style.setProperty("--sidebar-primary", primary);
        root.style.setProperty("--lvj-gold", primary);
      }
      if (accent) {
        root.style.setProperty("--accent", accent);
        root.style.setProperty("--lvj-blue", accent);
      }
      if (background) {
        root.style.setProperty("--background", background);
        root.style.setProperty("--card", background);
        root.style.setProperty("--popover", background);
        root.style.setProperty("--sidebar-background", background);
      }
      root.dataset.liturgicalSeason = theme.slug;
    }).catch(() => undefined);

    return () => { active = false; };
  }, [location.pathname]);

  return null;
}
