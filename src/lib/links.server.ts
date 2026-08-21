import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { LinkItem } from "@/lib/links-store";

type StoredLink = Database["public"]["Tables"]["bio_links"]["Row"];

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("El almacenamiento no está disponible.");

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function toLink(row: StoredLink): LinkItem {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    icon: row.icon as LinkItem["icon"],
    emoji: row.emoji ?? undefined,
    visible: row.visible,
  };
}

export async function readLinks() {
  const { data, error } = await publicClient()
    .from("bio_links")
    .select("id,label,url,icon,emoji,visible,sort_order,created_at,updated_at")
    .order("sort_order");
  if (error) throw new Error("No se pudieron cargar los enlaces.");
  return data.map(toLink);
}

export async function persistLinks(password: string, links: LinkItem[]) {
  const expectedPassword = process.env["BIO_ADMIN_PASSWORD"];
  if (!expectedPassword || password !== expectedPassword) throw new Error("Acceso incorrecto.");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows = links.map((link, sortOrder) => ({
    id: link.id,
    label: link.label,
    url: link.url,
    icon: link.icon,
    emoji: link.emoji ?? null,
    visible: link.visible,
    sort_order: sortOrder,
  }));

  const { data: existing, error: readError } = await supabaseAdmin.from("bio_links").select("id");
  if (readError) throw new Error("No se pudieron comprobar los enlaces.");

  if (rows.length > 0) {
    const { error } = await supabaseAdmin.from("bio_links").upsert(rows);
    if (error) throw new Error("No se pudieron guardar los enlaces.");
  }

  const incomingIds = new Set(rows.map((row) => row.id));
  const removedIds = (existing ?? []).map((row) => row.id).filter((id) => !incomingIds.has(id));
  if (removedIds.length > 0) {
    const { error } = await supabaseAdmin.from("bio_links").delete().in("id", removedIds);
    if (error) throw new Error("No se pudieron eliminar los enlaces.");
  }

  return rows.map((row) => ({ ...row, emoji: row.emoji ?? undefined })) as LinkItem[];
}

export function verifyAdminPassword(password: string) {
  return Boolean(process.env["BIO_ADMIN_PASSWORD"] && password === process.env["BIO_ADMIN_PASSWORD"]);
}