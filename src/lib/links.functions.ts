import { createServerFn } from "@tanstack/react-start";
import { persistLinks, readLinks, verifyAdminPassword } from "@/lib/links.server";
import type { LinkItem } from "@/lib/links-store";

export const getBioLinks = createServerFn({ method: "GET" }).handler(async () => readLinks());

export const loginBioAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => ({ valid: verifyAdminPassword(data.password) }));

export const saveBioLinks = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; links: LinkItem[] }) => data)
  .handler(async ({ data }) => persistLinks(data.password, data.links));