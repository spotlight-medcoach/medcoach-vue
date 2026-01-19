import * as data from '@/components/manuals/manualsData.json';
import { getTopicsCache, setTopicsCache } from '@/helpers/topicsCache';
const initTopic = data.topics[0];
const initSubtopic = initTopic.subtopics[0];

function sortManuals (a, b) {
  if (a.manual_name > b.manual_name) {
    return 1;
  }
  if (a.manual_name < b.manual_name) {
    return -1;
  }
  return 0;
}

function removeAccents (cadena) {
  const acentos = {
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
  };
  return cadena
    .split('')
    .map((letra) => acentos[letra] || letra)
    .join('')
    .toString();
}

export const state = () => ({
  data: data.topics,
  topic_index: 0,
  subtopic_index: 0,
  topic: initTopic,
  subtopic: initSubtopic,
  fetchedManuals: false,
  manuals: [],
});

export const mutations = {
  setTopic (state, index) {
    state.topic_index = index;
    state.topic = state.data[index];
    state.subtopic_index = 0;
    state.subtopic = state.topic.subtopics[0];
  },
  setTopics (state, topics) {
    const manualsArray = [];

    // Si topics es undefined o no es un array, usar array vacío
    const topicsArray = Array.isArray(topics) ? topics : [];

    state.data.forEach((topic, index) => {
      const auxTopic = topicsArray.find((e) => e.id === topic._id);

      // Si no se encuentra el topic en la respuesta, usar valores por defecto
      if (!auxTopic) {
        topic.progress = 0;
        topic.total = 0;
        // Para cada subtopic, inicializar con array vacío de manuals
        topic.subtopics.forEach((subtopic) => {
          subtopic.manuals = [];
        });
        return; // Continuar con el siguiente topic
      }

      topic.progress = auxTopic.progress || 0;
      topic.total = auxTopic.total || 0;

      topic.subtopics.forEach((subtopic, indexSub) => {
        // Validar que auxTopic.subtopics existe y tiene el índice
        if (!auxTopic.subtopics || !auxTopic.subtopics[indexSub]) {
          subtopic.manuals = [];
          return;
        }

        const auxSubtopic = auxTopic.subtopics[indexSub];
        const subtopicManuals = auxSubtopic.manuals || [];
        subtopic.manuals = subtopicManuals;

        subtopicManuals.forEach((manual) => {
          if (manual && manual.id && manual.name) {
            const obj = {
              manual_id: manual.id,
              manual_name: manual.name,
              subtopic_name: subtopic.name,
              topic_name: topic.name,
              finished: manual.finished || false,
              low_manual: removeAccents(manual.name.toLowerCase()),
              low_subtopic: removeAccents(subtopic.name.toLowerCase()),
              low_topic: removeAccents(topic.name.toLowerCase()),
            };
            manualsArray.push(obj);
          }
        });
      });
    });
    manualsArray.sort(sortManuals);
    state.manuals = manualsArray;
    state.fetchedManuals = true;
  },
  setSubtopic (state, index) {
    state.subtopic_index = index;
    state.subtopic = state.topic.subtopics[index];
  },
  setFetchedManuals (state, value) {
    state.fetchedManuals = value;
  },
};

export const actions = {
  /**
   * Obtiene los topics, primero verificando el caché
   * @param {boolean} forceRefresh - Si es true, ignora el caché y consulta la API
   */
  fetchTopics ({ commit }, forceRefresh = false) {
    // Verificar caché primero (a menos que se fuerce la actualización)
    if (!forceRefresh) {
      const cachedTopics = getTopicsCache();
      if (cachedTopics) {
        commit('setTopics', cachedTopics);
        return Promise.resolve(true);
      }
    }

    // Si no hay caché válido o se forzó actualización, consultar la API
    return this.$axios.get('/catalogues/topics').then((res) => {
      // La respuesta puede estar en res.data.data o directamente en res.data
      const responseData = res.data.data || res.data;
      const allManuals = responseData.topics || responseData;
      commit('setTopics', allManuals);
      // Guardar en caché
      setTopicsCache(allManuals);
      return true;
    });
  },
  changeTopic ({ commit }, index) {
    commit('setTopic', index);
  },
  changeSubtopic ({ commit }, index) {
    commit('setSubtopic', index);
  },
};
