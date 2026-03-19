import Link from "next/link";

function MockupCard({
  label,
  title,
  date,
  avatarColor = "bg-zinc-200",
  done = false,
}: {
  label: string;
  title: string;
  date: string;
  avatarColor?: string;
  done?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 mb-2 last:mb-0">
      <div className={`h-1 w-7 rounded-full ${label} mb-2`} />
      <p className={`text-[11px] mb-2 leading-tight ${done ? "line-through text-zinc-400" : "dark:text-zinc-200"}`}>
        {title}
      </p>
      <div className="flex items-center justify-between">
        <div className={`w-4 h-4 rounded-full ${avatarColor}`} />
        <span className="text-[10px] text-zinc-400">{date}</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          Gestión de proyectos simplificada
        </div>
        <h1 className="text-4xl md:text-[3.5rem] font-semibold tracking-tight leading-[1.08] mb-5">
          Organiza tu trabajo, <em className="not-italic text-blue-600 font-light">sin el caos.</em>
        </h1>
        <p className="text-base md:text-lg text-zinc-500 leading-relaxed mb-8 max-w-md">
          Projects M. es un tablero kanban colaborativo donde tu equipo puede planificar, asignar y entregar trabajo —
          todo en un solo lugar.
        </p>
        <div className="flex flex-wrap items-center gap-4 md:gap-5">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:opacity-85 transition-opacity no-underline"
          >
            Crear cuenta gratis
          </Link>
          <a
            href="#features"
            className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors no-underline"
          >
            Ver features →
          </a>
        </div>
      </div>

      <div className="relative hidden md:block">
        <div
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center gap-1.5 pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-200 font-medium">Desarrollo de software</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["To Do", "En progreso", "Done"] as const).map((list, i) => (
              <div
                key={list}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3"
              >
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300 uppercase tracking-widest mb-2">
                  {list}
                </p>
                {i === 0 && (
                  <>
                    <MockupCard label="bg-blue-100" title="Diseñar arquitectura" date="12 mar" />
                    <MockupCard label="bg-pink-100" title="Setup CI/CD" date="15 mar" avatarColor="bg-pink-200" />
                  </>
                )}
                {i === 1 && (
                  <MockupCard label="bg-green-100" title="Auth con Supabase" date="14 mar" avatarColor="bg-blue-200" />
                )}
                {i === 2 && <MockupCard label="bg-zinc-100" title="Setup del proyecto" date="10 mar" done />}
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute -bottom-5 -left-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
        >
          <div className="w-8 h-8 bg-green-100 dark:bg-emerald-600 rounded-lg flex items-center justify-center text-sm shrink-0">
            ✓
          </div>
          <div>
            <p className="text-xs font-medium leading-none mb-1">3 tareas completadas</p>
            <p className="text-[10px] text-zinc-400 leading-none">hoy · equipo de 4</p>
          </div>
        </div>
      </div>
    </section>
  );
}
