export const phaseVariants = {
	1: {
		title: 'Fase 1',
		textOverview: 'Estudiar manuales y realizar notas / flashcards de todos los temas',
		componentStyle: 'blue',
		scope: 'manuals',
		total: 0,
		progress: 0,
		enabled: false
	},
	2: {
		title: 'Fase 2',
		textOverview: 'Repaso de notas y flashcards con algoritmo de repetición espaciada',
		componentStyle: 'orange',
		scope: 'days',
		total: 0,
		progress: 0,
		enabled: false
	},
	3: {
		title: 'Fase 3',
		textOverview: 'Repaso de los temas más relevantes para el ENARM (se activa automáticamente 40 días antes del examen)',
		componentStyle: 'pink',
		scope: 'days',
		total: 0,
		progress: 0,
		enabled: false
	}
}
