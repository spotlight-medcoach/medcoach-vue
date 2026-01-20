function shuffleArray (array) {
  let currentIndex = array.length;
  let randomIndex = null;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export const state = () => ({
  flashcards: null,
  random_activated: false,
  repeat_activated: false,
  selected_flashcard_id: null,
  manual_id: null,
});

export const getters = {
  flashcards: (state) => state.flashcards,
  selectedFlashcard: (state) =>
    state.flashcards.find(
      (flashcard) => flashcard._id === state.selected_flashcard_id,
    ),
  randomActivated: (state) => state.random_activated,
  repeatActivated: (state) => state.repeat_activated,
  selectedFlashcardId: (state) => state.selected_flashcard_id,
};

export const mutations = {
  setFlashcards (state, flashcards) {
    flashcards = flashcards.map((flashcard, index) => {
      return {
        ...flashcard,
        index,
      };
    });
    if (state.random_activated) {
      flashcards = shuffleArray(flashcards);
    }
    state.flashcards = flashcards;
  },
  setFlashcardId (state, flashcardId) {
    state.selected_flashcard_id = flashcardId;
  },
  setRandomActivated (state, payload) {
    state.random_activated = payload;
    if (payload) {
      let array = JSON.parse(JSON.stringify(state.flashcards));
      array = shuffleArray(array);
      state.flashcards = array;
    } else {
      state.flashcards = state.flashcards.sort((a, b) => {
        return a.index - b.index;
      });
    }
  },
  setRepeatActivated (state, payload) {
    state.repeat_activated = payload;
  },
  setManualId (state, payload) {
    state.manual_id = payload;
  },
};

export const actions = {
  fetchFlashcards ({ commit }) {
    return this.$axios.$get('/student/flashcards').then((response) => {
      commit('setFlashcards', response.flashcards);
      return true;
    });
  },
  fetchFlashcardsByManualId ({ commit }, manualId) {
    return this.$axios
      .get(`/student/flashcards?manual_id=${manualId}`)
      .then((response) => {
        commit('setFlashcards', response.data.flashcards);
        return true;
      });
  },
  async deleteFlashcard ({ commit, dispatch, state }, flashcardId) {
    try {
      const { data } = await this.$axios.delete(
        `/student/flashcards/${flashcardId}`,
      );
      await dispatch('fetchFlashcardsByManualId', state.manual_id);
      this._vm.$toastr.success('Flashcard eliminada correctamente', '¡Éxito!');
      return data;
    } catch (error) {
      console.error(error);
      this._vm.$toastr.error(
        'Hubo un problema al eliminar su flashcard',
        'Error',
      );
    }
  },
  async updateFlashcard ({ commit, dispatch, state }, formData) {
    try {
      const { id, ...bodyData } = formData;
      const { data } = await this.$axios.put(
        `/student/flashcards/${id}`,
        bodyData,
      );
      await dispatch('fetchFlashcardsByManualId', state.manual_id);
      this._vm.$toastr.success(
        'Flashcard actualizada correctamente',
        '¡Éxito!',
      );
      return data;
    } catch (error) {
      console.error(error);
      this._vm.$toastr.error(
        'Hubo un problema al guardar su flashcard',
        'Error',
      );
    }
  },
  async createFlashcard ({ commit, dispatch, state }, formData) {
    try {
      const { data } = await this.$axios.post('/student/flashcards', formData);
      await dispatch('fetchFlashcardsByManualId', state.manual_id);
      this._vm.$toastr.success('Flashcard agregada correctamente', '¡Éxito!');
      return data;
    } catch (error) {
      console.error(error);
      this._vm.$toastr.error(
        'Hubo un problema al guardar su flashcard',
        'Error',
      );
    }
  },
};
