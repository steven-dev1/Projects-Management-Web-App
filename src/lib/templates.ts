// lib/templates.ts
export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lists: {
    name: string;
    cards: { title: string }[];
  }[];
}

export const boardTemplates: BoardTemplate[] = [
  {
    id: "software",
    name: "Desarrollo de software",
    description: "Gestiona el ciclo de vida de tu proyecto con listas clásicas de desarrollo.",
    icon: "💻",
    color: "#006fee",
    lists: [
      { name: "To Do", cards: [{ title: "Definir requerimientos" }, { title: "Diseñar arquitectura" }] },
      { name: "In Progress", cards: [{ title: "Implementar autenticación" }] },
      { name: "En revisión", cards: [] },
      { name: "Done", cards: [] },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Organiza tus campañas y contenido desde la idea hasta la publicación.",
    icon: "📣",
    color: "#f9c23c",
    lists: [
      { name: "Ideas", cards: [{ title: "Post para redes sociales" }, { title: "Newsletter mensual" }] },
      { name: "En proceso", cards: [{ title: "Diseño de banner" }] },
      { name: "Revisión", cards: [] },
      { name: "Publicado", cards: [] },
    ],
  },
  {
    id: "project-management",
    name: "Gestión de proyectos",
    description: "Controla el avance de tu equipo desde el backlog hasta la entrega.",
    icon: "📋",
    color: "#eeeeef",
    lists: [
      { name: "Backlog", cards: [{ title: "Definir alcance del proyecto" }, { title: "Asignar responsables" }] },
      { name: "En curso", cards: [{ title: "Reunión de kickoff" }] },
      { name: "Revisar", cards: [] },
      { name: "Listo", cards: [] },
    ],
  },
  {
    id: "hr",
    name: "Recursos humanos",
    description: "Lleva el seguimiento de candidatos en tu proceso de selección.",
    icon: "👥",
    color: "#4a26d9",
    lists: [
      { name: "Aplicantes", cards: [{ title: "Revisar CVs recibidos" }] },
      { name: "Entrevista", cards: [{ title: "Agendar entrevistas" }] },
      { name: "Oferta", cards: [] },
      { name: "Contratado", cards: [] },
    ],
  },
  {
    id: "sales",
    name: "Ventas",
    description: "Gestiona tu pipeline de ventas y da seguimiento a cada oportunidad.",
    icon: "💰",
    color: "#d9bb26",
    lists: [
      { name: "Leads", cards: [{ title: "Investigar prospecto" }] },
      { name: "Contactado", cards: [{ title: "Enviar propuesta inicial" }] },
      { name: "Propuesta", cards: [] },
      { name: "Cerrado", cards: [] },
    ],
  },
  {
    id: "learning",
    name: "Aprendizaje",
    description: "Organiza tus metas de aprendizaje, rutinas e idiomas.",
    icon: "📚",
    color: "#86d72f",
    lists: [
      { name: "Por aprender", cards: [{ title: "Vocabulario básico inglés" }, { title: "Curso de TypeScript" }] },
      { name: "En progreso", cards: [{ title: "Practicar conversación" }] },
      { name: "Practicando", cards: [] },
      { name: "Dominado", cards: [] },
    ],
  },
];