import { LIST_COLORS } from "./consts";

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
    color: LIST_COLORS[6].id,
    lists: [
      {
        name: "Backlog",
        cards: [
          { title: "Definir requerimientos funcionales" },
          { title: "Definir requerimientos técnicos" },
          { title: "Diseñar arquitectura base" },
        ],
      },
      {
        name: "To Do",
        cards: [{ title: "Configurar entorno de desarrollo" }, { title: "Crear estructura del proyecto" }],
      },
      {
        name: "In Progress",
        cards: [{ title: "Implementar autenticación" }, { title: "Crear API base" }],
      },
      {
        name: "Code Review",
        cards: [{ title: "Revisar PRs abiertos" }],
      },
      {
        name: "Testing",
        cards: [{ title: "Escribir tests unitarios" }],
      },
      {
        name: "Done",
        cards: [],
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Organiza tus campañas y contenido desde la idea hasta la publicación.",
    icon: "📣",
    color: LIST_COLORS[3].id,
    lists: [
      {
        name: "Ideas",
        cards: [
          { title: "Post para redes sociales" },
          { title: "Campaña de email marketing" },
          { title: "Colaboración con influencer" },
        ],
      },
      {
        name: "Planificación",
        cards: [{ title: "Definir calendario de contenido" }, { title: "Segmentar audiencia objetivo" }],
      },
      {
        name: "En proceso",
        cards: [{ title: "Diseño de banner" }, { title: "Redacción de copy" }],
      },
      {
        name: "Revisión",
        cards: [{ title: "Aprobar contenido final" }],
      },
      {
        name: "Publicado",
        cards: [{ title: "Publicar en redes sociales" }],
      },
      {
        name: "Análisis",
        cards: [{ title: "Revisar métricas de campaña" }],
      },
    ],
  },
  {
    id: "project-management",
    name: "Gestión de proyectos",
    description: "Controla el avance de tu equipo desde el backlog hasta la entrega.",
    icon: "📋",
    color: LIST_COLORS[9].id,
    lists: [
      {
        name: "Backlog",
        cards: [{ title: "Definir alcance del proyecto" }, { title: "Identificar stakeholders" }],
      },
      {
        name: "Planificación",
        cards: [{ title: "Asignar tareas al equipo" }, { title: "Definir cronograma" }],
      },
      {
        name: "En curso",
        cards: [{ title: "Reunión de kickoff" }, { title: "Seguimiento semanal" }],
      },
      {
        name: "Bloqueado",
        cards: [{ title: "Resolver dependencias externas" }],
      },
      {
        name: "Revisar",
        cards: [{ title: "Validar entregables" }],
      },
      {
        name: "Completado",
        cards: [],
      },
    ],
  },
  {
    id: "hr",
    name: "Recursos humanos",
    description: "Lleva el seguimiento de candidatos en tu proceso de selección.",
    icon: "👥",
    color: LIST_COLORS[7].id,
    lists: [
      {
        name: "Aplicantes",
        cards: [{ title: "Revisar CVs recibidos" }, { title: "Filtrar candidatos iniciales" }],
      },
      {
        name: "Preselección",
        cards: [{ title: "Contactar candidatos" }],
      },
      {
        name: "Entrevista",
        cards: [{ title: "Agendar entrevistas" }, { title: "Realizar entrevistas técnicas" }],
      },
      {
        name: "Evaluación",
        cards: [{ title: "Comparar candidatos" }],
      },
      {
        name: "Oferta",
        cards: [{ title: "Enviar propuesta laboral" }],
      },
      {
        name: "Contratado",
        cards: [{ title: "Onboarding del empleado" }],
      },
    ],
  },
  {
    id: "sales",
    name: "Ventas",
    description: "Gestiona tu pipeline de ventas y da seguimiento a cada oportunidad.",
    icon: "💰",
    color: LIST_COLORS[2].id,
    lists: [
      {
        name: "Leads",
        cards: [{ title: "Investigar prospecto" }, { title: "Recolectar datos de contacto" }],
      },
      {
        name: "Contactado",
        cards: [{ title: "Enviar email inicial" }, { title: "Programar llamada" }],
      },
      {
        name: "Calificado",
        cards: [{ title: "Validar interés del cliente" }],
      },
      {
        name: "Propuesta",
        cards: [{ title: "Enviar propuesta comercial" }],
      },
      {
        name: "Negociación",
        cards: [{ title: "Ajustar términos del contrato" }],
      },
      {
        name: "Cerrado",
        cards: [{ title: "Cerrar venta" }],
      },
    ],
  },
  {
    id: "learning",
    name: "Aprendizaje",
    description: "Organiza tus metas de aprendizaje, rutinas e idiomas.",
    icon: "📚",
    color: LIST_COLORS[4].id,
    lists: [
      {
        name: "Por aprender",
        cards: [
          { title: "Vocabulario básico inglés" },
          { title: "Curso de TypeScript" },
          { title: "Fundamentos de algoritmos" },
        ],
      },
      {
        name: "En progreso",
        cards: [{ title: "Practicar conversación" }, { title: "Ver clases del curso" }],
      },
      {
        name: "Practicando",
        cards: [{ title: "Hacer ejercicios prácticos" }, { title: "Construir mini proyectos" }],
      },
      {
        name: "Repaso",
        cards: [{ title: "Revisar temas anteriores" }],
      },
      {
        name: "Dominado",
        cards: [{ title: "Aplicar en proyecto real" }],
      },
    ],
  },
];
