export const mockData = {
  usuario: {
    nombre: "Alex Rivero",
    plan: "Premium",
    estadisticas: {
      nivel_estres_semanal: "Bajo",
      sesiones_completadas: 12
    }
  },
  citas_proximas: [
    {
      terapeuta: "Dra. Elena Rostova",
      fecha: "12 de Junio, 2026",
      hora: "15:00",
      estado: "Confirmada"
    }
  ]
};

export const therapistsData = [
  {
    id: 1,
    name: "Dra. Elena Rostova",
    specialty: "Especialista en Burnout Laboral",
    rating: 4.9,
    reviews: 120,
    description: "Enfocada en reconectar tu mente y tu entorno de trabajo."
  },
  {
    id: 2,
    name: "Lic. Mateo Vargas",
    specialty: "Instructor de Mindfulness y Ansiedad",
    rating: 4.8,
    reviews: 85,
    description: "Aprende a respirar a través del caos."
  },
  {
    id: 3,
    name: "Dra. Sarah Jenkins",
    specialty: "Psicología Cognitivo-Conductual",
    rating: 5.0,
    reviews: 200,
    description: "Estrategias prácticas para el día a día."
  }
];
