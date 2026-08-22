import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { User, X, Plus, Trash2, Pencil, LogOut, Check, Eye, EyeOff, LoaderCircle, ChevronRight } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import { BrandIcon } from "@/components/BrandIcons";
import { GlamDecor } from "@/components/GlamDecor";
import { ADMIN_USER, type IconKey, type LinkItem } from "@/lib/links-store";
import { getBioLinks, loginBioAdmin, saveBioLinks } from "@/lib/links.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arinails · Uñas, Cejas, Pestañas y Cabello" },
      {
        name: "description",
        content:
          "Enlaces oficiales de Arinails Beauty Salon: reserva por WhatsApp y síguenos en Instagram, Facebook y TikTok.",
      },
      { property: "og:title", content: "Arinails · Beauty Salon" },
      {
        property: "og:description",
        content: "Uñas • Cejas • Pestañas • Cabello. Todos nuestros enlaces en un solo lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getBioLinks(),
  component: Index,
});

const BRAND = "Arinails";
const BIO = "Uñas • Cejas • Pestañas • Cabello";

function Index() {
  const initialLinks = Route.useLoaderData();
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const loginAdmin = useServerFn(loginBioAdmin);
  const persist = useServerFn(saveBioLinks);

  const update = async (next: LinkItem[]) => {
    const previous = links;
    setLinks(next);
    setSaving(true);
    setSaveError("");
    try {
      const saved = await persist({ data: { password: adminPassword, links: next } });
      setLinks(saved);
    } catch {
      setLinks(previous);
      setSaveError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = user.trim() === ADMIN_USER ? await loginAdmin({ data: { password: pass } }) : { valid: false };
    if (result.valid) {
      setIsAdmin(true);
      setAdminPassword(pass);
      setLoginOpen(false);
      setError("");
      setUser("");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  const visible = links.filter((l) => l.visible);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-glow" />
      <GlamDecor />

      <div className="relative z-10 mx-auto w-full max-w-md px-6 pb-16 pt-6">
        <div className="flex justify-end">
          {isAdmin ? (
            <button
              onClick={() => setIsAdmin(false)}
              className="soft-chip"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.6} />
            </button>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="soft-chip"
              aria-label="Acceso administradora"
            >
              <User className="h-4 w-4" strokeWidth={1.6} />
            </button>
          )}
        </div>

        <header className="mt-2 flex flex-col items-center text-center">
          <div className="rounded-full border border-gold/60 p-2">
            <div className="rounded-full bg-gradient-gold p-[2px] shadow-glam">
              <img
                src={profileImg}
                alt="Logo de Arinails Beauty Salon"
                width={816}
                height={816}
                className="h-28 w-28 rounded-full border-4 border-background object-cover"
              />
            </div>
          </div>
          <h1 className="mt-5 font-display text-[2.6rem] leading-none font-medium tracking-tight text-foreground">
            {BRAND}
          </h1>
          <p className="mt-3 text-[11px] uppercase tracking-[0.42em] text-muted-foreground">
            Beauty Studio
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="mt-4 text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
            {BIO}
          </p>
        </header>

        <section className="mt-8 space-y-3.5">
          {visible.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="glam-link group"
            >
              <span className="glam-icon">
                <BrandIcon icon={l.icon} emoji={l.emoji} className="h-5 w-5" />
              </span>
              <span className="flex-1 text-left">{l.label}</span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </a>
          ))}

          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
              No hay enlaces visibles.
            </p>
          )}
        </section>

        {isAdmin && (
          <AdminPanel links={links} onChange={update} saving={saving} saveError={saveError} />
        )}

        <footer className="mt-12 flex flex-col items-center text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} {BRAND}
          </p>

          <div className="mt-2 h-px w-8 bg-gradient-to-r from-transparent via-border to-transparent" />

          <a
            href="https://api.whatsapp.com/send?phone=584128616071&text=Hola%20DEIVI%2C%20vi%20la%20landing%20page%20de%20Arinails%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n%20para%20una%20p%C3%A1gina%20igual%20o%20similar"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 flex flex-col items-center"
            aria-label="Desarrollado por DEIVI - contactar por WhatsApp"
          >
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/80">
              Desarrollado por
            </span>
            <span className="font-display text-[13px] italic tracking-[0.05em] text-rose-gold transition-colors duration-300 group-hover:text-gold">
              DEIVI
            </span>
            <span className="mt-0.5 h-px w-0 bg-rose-gold/50 transition-all duration-500 group-hover:w-full" />
          </a>
        </footer>
      </div>

      {loginOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 px-6 backdrop-blur-sm">
          <form
            onSubmit={submitLogin}
            className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-glam"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl text-foreground">Acceso</h2>
                <p className="mt-1 text-xs text-muted-foreground">Solo administradora</p>
              </div>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="soft-chip"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>

            <label className="mt-5 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Usuario
            </label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="glam-input mt-1.5"
              autoComplete="username"
            />

            <label className="mt-4 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Contraseña
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="glam-input mt-1.5"
              autoComplete="current-password"
            />

            {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

            <button type="submit" className="glam-button mt-6 w-full">
              Entrar
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function AdminPanel({
  links,
  onChange,
  saving,
  saveError,
}: {
  links: LinkItem[];
  onChange: (l: LinkItem[]) => Promise<void>;
  saving: boolean;
  saveError: string;
}) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<IconKey>("instagram");
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    await onChange([
      ...links,
      {
        id: `custom-${Date.now()}`,
        label: label.trim(),
        url: url.trim(),
        icon,
        visible: true,
      },
    ]);
    setLabel("");
    setIcon("instagram");
    setUrl("");
  };

  const patch = (id: string, data: Partial<LinkItem>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...data } : l)));

  const iconOptions: { value: IconKey; label: string }[] = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "telegram", label: "Telegram" },
    { value: "website", label: "Página web" },
    { value: "email", label: "Correo" },
  ];

  return (
    <section className="mt-10 rounded-3xl border border-border bg-card/80 p-5 shadow-glam">
      <h2 className="font-display text-2xl text-foreground">Panel de administración</h2>
      <div className="mt-1 flex min-h-5 items-center gap-1.5 text-xs text-muted-foreground">
        {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
        <span>{saving ? "Guardando…" : "Los cambios quedan guardados permanentemente"}</span>
      </div>
      {saveError && <p className="mt-2 text-xs text-destructive">{saveError}</p>}

      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.id} className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="glam-icon h-8 w-8 shrink-0">
                  <BrandIcon icon={l.icon} emoji={l.emoji} className="h-4 w-4" />
                </span>
                <span className="truncate text-sm text-foreground">{l.label}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => setEditing(editing === l.id ? null : l.id)}
                  className="soft-chip"
                  aria-label={`Editar ${l.label}`}
                >
                  {editing === l.id ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                  )}
                </button>
                <button
                  onClick={() => onChange(links.filter((x) => x.id !== l.id))}
                  className="soft-chip"
                  aria-label={`Eliminar ${l.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  aria-pressed={l.visible}
                  aria-label={l.visible ? `Ocultar ${l.label}` : `Mostrar ${l.label}`}
                  onClick={() => patch(l.id, { visible: !l.visible })}
                  className={`soft-chip ${l.visible ? "text-primary" : "text-muted-foreground/50"}`}
                >
                  {l.visible ? (
                    <Eye className="h-4 w-4" strokeWidth={1.7} />
                  ) : (
                    <EyeOff className="h-4 w-4" strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </div>

            {editing === l.id && (
              <div className="mt-3 space-y-2">
                <input
                  value={l.label}
                  onChange={(e) => patch(l.id, { label: e.target.value })}
                  className="glam-input"
                  placeholder="Texto del botón"
                />
                <input
                  value={l.url}
                  onChange={(e) => patch(l.id, { url: e.target.value })}
                  className="glam-input"
                  placeholder="Enlace / URL"
                />
                <div className="grid grid-cols-4 gap-2 pt-1" aria-label={`Icono de ${l.label}`}>
                  {iconOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      title={option.label}
                      aria-label={option.label}
                      aria-pressed={l.icon === option.value}
                      onClick={() => {
                        const next = links.map((item) => {
                          if (item.id !== l.id) return item;
                          const { emoji: _emoji, ...rest } = item;
                          return { ...rest, icon: option.value };
                        });
                        void onChange(next);
                      }}
                      className={`grid h-10 place-items-center rounded-xl border transition-colors ${
                        l.icon === option.value
                          ? "border-primary bg-accent text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <BrandIcon icon={option.value} className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-6 space-y-2 border-t border-border/70 pt-5">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Agregar botón
        </h3>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="glam-input"
          placeholder="Texto del botón"
        />
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Selecciona un icono</p>
          <div className="grid grid-cols-4 gap-2">
            {iconOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                title={option.label}
                aria-label={option.label}
                aria-pressed={icon === option.value}
                onClick={() => setIcon(option.value)}
                className={`grid h-11 place-items-center rounded-xl border transition-colors ${
                  icon === option.value
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <BrandIcon icon={option.value} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="glam-input"
          placeholder="Enlace / URL"
        />
        <button disabled={saving} type="submit" className="glam-button flex w-full items-center justify-center gap-2 disabled:opacity-60">
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" strokeWidth={2} />}
          {saving ? "Guardando" : "Agregar"}
        </button>
      </form>
    </section>
  );
}
