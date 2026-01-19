<template>
  <div id="manual-notes" class="h-100">
    <quill-editor
      ref="noteQuillEditor"
      v-model="content"
      class="h-100"
      :options="editorOption"
      @change="savedNotes = false"
      @blur="onEditorBlur($event)"
    />
    <b-button
      class="save-button w-100 position-absolute"
      variant="primary"
      :disabled="savingNotes"
      @click="saveNote"
    >
      {{ savingNotes ? 'Guardando notas ...' : 'Guardar notas' }}
      <b-spinner v-if="savingNotes" small />
      <b-icon v-if="savedNotesCheck === true" icon="check" />
      <b-icon v-if="savedNotesCheck === false" icon="x" />
    </b-button>
    <b-modal
      id="modal-before-leave"
      title="Confirmación"
      cancel-title="Cancelar"
      cancel-variant="danger"
      centered
      @ok="next"
      @cancel="redirect"
    >
      <p class="my-2">¿Quieres salir de está página?</p>
      <p class="my-2">
        Recuerda que el progreso no guardado de tus notas se perderá, para
        guardar tus notas, da clic en el icono de guardado.
      </p>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    manualId: {
      type: String,
      default: undefined,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      next: () => true,
      content: '',
      cursor_index: null,
      savingNotes: false,
      savedNotesCheck: undefined,
      savedNotes: true,
      saveOnTimelapseListener: undefined,
      saveOnTimelapseLastState: '',
      studyTimeTimelapseListener: undefined,
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline'],
              [
                { align: [] },
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
                { color: ['#000500', '#FE9400', '#0070C0'] },
                { background: ['#FE9400', '#FFFFFF', '#FFFF00'] },
              ],
            ],
          },
        },
      },
    };
  },
  computed: {
    editor () {
      return this.$refs.noteQuillEditor.quill;
    },
    ...mapGetters({
      manualsTimelapse: 'studytime/manualsTimelapse',
    }),
  },
  watch: {
    notes (newNotes) {
      if (newNotes && newNotes.trim() !== '') {
        this.insertNotesAtCursor(newNotes);
      }
    },
  },
  async created () {
    await this.getManualNote();
  },
  mounted () {
    window.toastr.options = {
      positionClass: 'toast-bottom-right',
    };
  },
  methods: {
    insertNotesAtCursor (htmlContent) {
      this.$nextTick(() => {
        const quill = this.editor;
        // Enfocar el editor para asegurar que el placeholder desaparezca
        quill.focus();

        // Obtener la selección actual o usar la última posición guardada
        const range = quill.getSelection(true);
        let insertIndex;

        if (range) {
          insertIndex = range.index;
        } else if (
          this.cursor_index !== undefined &&
          this.cursor_index !== null
        ) {
          insertIndex = this.cursor_index;
        } else {
          // Si no hay posición guardada, insertar al final
          insertIndex = quill.getLength() - 1;
        }

        // Insertar un salto de línea antes del contenido si no estamos al inicio
        if (insertIndex > 0) {
          quill.insertText(insertIndex, '\n', 'api');
          insertIndex += 1;
        }

        // Usar dangerouslyPasteHTML para insertar HTML en la posición correcta
        quill.clipboard.dangerouslyPasteHTML(insertIndex, htmlContent, 'api');

        // Mover el cursor al final del contenido insertado
        this.$nextTick(() => {
          const newLength = quill.getLength();
          quill.setSelection(newLength - 1, 0, 'api');
        });
      });
    },
    onEditorBlur (event) {
      // Guardar la posición del cursor cuando el editor pierde el foco
      if (event.selection && event.selection.savedRange) {
        this.cursor_index = event.selection.savedRange.index;
      }
    },
    getManualNote () {
      return this.$axios
        .get(`/student/manuals/note?manual_id=${this.manualId}`)
        .then((res) => {
          this.editor.clipboard.dangerouslyPasteHTML(res.data.data.note);
          this.finished = res.data.finished;
          this.$emit('isFinished', this.finished);
          this.autoSave();
          this.addStudyTime();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    autoSave () {
      this.saveOnTimelapseListener = setInterval(
        function () {
          if (this.saveOnTimelapseLastState !== this.content) {
            this.saveNote();
            this.saveOnTimelapseLastState = this.content;
          }
        }.bind(this),
        30000,
      );
    },
    addStudyTime () {
      this.studyTimeTimelapseListener = setInterval(
        function () {
          this.$store.dispatch('studytime/addStudyTime', 'manuals');
        }.bind(this),
        this.manualsTimelapse * 60000,
      );
    },
    redirect () {
      this.next(this.from);
    },
    async saveNote () {
      if (this.content.trim() !== '') {
        const params = {
          manual_id: this.manualId,
          body: this.content,
        };
        this.savingNotes = true;
        const data = await this.$store.dispatch('manuals/saveNote', params);
        if (data) {
          this.savedNotes = true;
          this.savedNotesCheck = true;
          setTimeout(() => {
            this.savedNotesCheck = undefined;
          }, 1000);
        } else {
          this.savedNotesCheck = false;
        }
        this.savingNotes = undefined;
      }
    },
    finalize () {
      clearInterval(this.saveOnTimelapseListener);
      clearInterval(this.studyTimeTimelapseListener);
      return this.saveNote();
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/css/variables/color-palette.scss';
#manual-notes {
  position: relative;
  .quill-editor {
    .ql-container {
      position: relative;
      height: calc(100% - 98px);
      *:hover::-webkit-scrollbar-track {
        background: transparent;
      }
      .b-button {
        bottom: 0;
      }
    }
  }
  .ql-toolbar.ql-snow {
    padding: 16px 0;
    .ql-formats {
      margin-right: 0;
    }
  }
  .save-button {
    bottom: 0;
  }
}
</style>
