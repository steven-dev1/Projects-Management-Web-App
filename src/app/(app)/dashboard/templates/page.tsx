import TemplateCard from "@/components/Dashboard/Templates/TemplateCard";
import { boardTemplates } from "@/lib/templates";
export default function TemplatesPage() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Plantillas</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Crea un board nuevo a partir de una plantilla predefinida.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boardTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
