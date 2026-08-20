export type IconKey = "instagram" | "facebook" | "whatsapp" | "tiktok" | "custom";

export type LinkItem = {
  id: string;
  label: string;
  url: string;
  icon: IconKey;
  emoji?: string;
  visible: boolean;
};

// Reemplaza estos marcadores de posición por tus enlaces reales.
export const INSTAGRAM_URL = "INSTAGRAM_URL_HERE";
export const FACEBOOK_URL = "FACEBOOK_URL_HERE";
export const WHATSAPP_URL = "WHATSAPP_URL_HERE";
export const TIKTOK_URL = "TIKTOK_URL_HERE";

export const DEFAULT_LINKS: LinkItem[] = [
  { id: "instagram", label: "Instagram", url: INSTAGRAM_URL, icon: "instagram", visible: true },
  { id: "facebook", label: "Facebook", url: FACEBOOK_URL, icon: "facebook", visible: true },
  { id: "whatsapp", label: "WhatsApp", url: WHATSAPP_URL, icon: "whatsapp", visible: true },
  { id: "tiktok", label: "TikTok", url: TIKTOK_URL, icon: "tiktok", visible: true },
];

const STORAGE_KEY = "bio-links-v1";

// Credenciales de la administradora (demo, sin backend).
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "belle2026";

export function loadLinks(): LinkItem[] {
  if (typeof window === "undefined") return DEFAULT_LINKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LINKS;
    const parsed = JSON.parse(raw) as LinkItem[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_LINKS;
  } catch {
    return DEFAULT_LINKS;
  }
}

export function saveLinks(links: LinkItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    /* ignore */
  }
}
