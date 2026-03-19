import Link from "next/link";
import { FEATURES, STATS } from "./LandingData";

export function StatsSection() {
  return (
    <div className="border-y border-zinc-200 dark:border-zinc-800 py-10 px-6 md:px-10 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl md:text-4xl font-semibold tracking-tight">{s.num}</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-300 font-light mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 max-w-6xl mx-auto" id="features">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Features</p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
        Todo lo que necesitas
        <br />
        para trabajar mejor.
      </h2>
      <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-12 md:mb-16 leading-relaxed">
        Desde tableros kanban hasta notificaciones en tiempo real — diseñado para equipos que quieren moverse rápido.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-100 cursor-default"
          >
            <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-xl mb-5`}>
              {f.icon}
            </div>
            <h3 className="text-base font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-zinc-500 font-light leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 md:py-32 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
          Listo para <em className="not-italic text-blue-600 font-light">organizarte de verdad?</em>
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 font-light mb-10 leading-relaxed">
          Crea tu primer board en menos de un minuto. Sin tarjeta de crédito, sin complicaciones.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white text-base font-medium px-8 py-4 rounded-xl hover:opacity-85 transition-opacity no-underline"
        >
          Empezar gratis →
        </Link>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Vistas", href: "#vistas" },
  { label: "Iniciar sesión", href: "/signin" },
  { label: "Registro", href: "/signup" },
];

export function LandingFooter() {
  return (
    <footer className="px-6 md:px-10 py-10 md:py-12 border-t border-zinc-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold tracking-tight no-underline">
          Projects <span className="text-blue-400">M.</span>
        </Link>
        <ul className="flex flex-wrap justify-center gap-6 md:gap-8 list-none m-0">
          {FOOTER_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors no-underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="text-sm text-zinc-400">© 2026 Projects M.</span>
      </div>
    </footer>
  );
}
