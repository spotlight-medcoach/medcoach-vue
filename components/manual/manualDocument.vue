<template>
  <div id="manual-document" :style="{ 'background-color': actualColorBg }">
    <template
      v-if="showLoading"
      id="loading-state"
      class="d-flex align-items-center justify-content-center"
      style="height: 85vh"
    >
      <loading-state v-if="!error_http" :message="message" />
      <div v-else style="font-size: 28px">
        {{ message_error }}
      </div>
    </template>
    <template v-else>
      <!-- DOCUMENT FILE HTML -->
      <div
        id="content"
        ref="content"
        :style="`font-size: ${fontSize}em; color: ${actualColorFont}`"
        oncopy="return false"
        oncut="return false"
        onpaste="return false"
        class="widthS"
      >
        <div
          ref="manual-html"
          class="p-3 px-4"
          @contextmenu.prevent.stop="return true;"
          @mouseup.prevent.stop="
            handleMouseUp($event, { selection: my_window.getSelection() })
          "
          v-html="manualHTML /* eslint-disable-line vue/no-v-html */"
        />
      </div>
      <!-- CONTEXT MENU -->
      <vue-simple-context-menu
        :ref="'vueContextMenu'"
        :element-id="'contextMenu'"
        :options="optionsMenu"
        @option-clicked="optionClicked"
      />
    </template>
  </div>
</template>

<script>
import LoadingState from '@/components/LoadingState.vue';
export default {
  components: {
    LoadingState,
  },
  props: {
    manualId: {
      type: String,
      default: undefined,
    },
    fontSize: {
      type: Number,
      default: 1,
    },
    brightness: undefined,
  },
  data () {
    return {
      showLoading: true,
      my_window: window,
      manualHTML: null,
      html_selection: '',
      selection: '',
      cursor_index: 0,
      showFlashCards: false,
      optionsMenu: [
        {
          name: 'Agregar a notas',
          slug: 'agregar-nota',
          class: 'note-option',
          id: 1,
        },
        {
          name: 'Crear Flashcard',
          slug: 'crear-flashcard',
          class: 'flashcard-option',
          id: 2,
        },
      ],
      message: 'Cargando manual, por favor espere',
      message_error: 'Ocurrió un error su petición',
      error_http: false,
    };
  },
  computed: {
    actualColorBg () {
      return this.brightness.background;
    },
    actualColorFont () {
      return this.brightness.font;
    },
    actualColorBtn () {
      return this.brightness.button;
    },
  },
  watch: {
    async manualId () {
      this.showLoading = true;
      await this.getManualHTML();
      this.showLoading = false;
    },
  },
  async created () {
    await this.getManualHTML();
    this.showLoading = false;
  },
  methods: {
    getManualHTML () {
      return this.$axios
        .get(`/student/manuals?manual_id=${this.manualId}`)
        .then((res) => {
          this.manualHTML = res.data;
          this.$emit('onFetchedManual');
        })
        .catch((err) => {
          console.error(err);
        });
    },
    changeFontSize (change) {
      const scale = 0.1;
      const newFontSize = +parseFloat(change * scale + this.fontSize).toFixed(
        1,
      );
      if (newFontSize >= 1 && newFontSize <= 1.4) {
        this.$emit('update:fontSize', newFontSize);
      }
    },
    changeBrightness (brightnessState) {
      this.actualColorBg = brightnessState.background;
      this.actualColorBtn = brightnessState.button;
      this.actualColorFont = brightnessState.font;
    },
    handleMouseUp (event, item) {
      if (event.target.localName === 'img') {
        const modal = document.getElementById('myModal');
        const modalImg = document.getElementById('img01');
        const captionText = document.getElementById('caption');
        modalImg.src = event.target.src;
        captionText.innerHTML = event.target.alt;
        modal.style.display = 'block';
      }
      this.selection = item.selection.toString().trim();
      this.html_selection = this.selection2Html(item.selection);
      if (this.html_selection !== '') {
        setTimeout(() => {
          this.showMenu(event, item);
        }, 250);
      }
      this.html_selection += '<p><br></p>';
    },
    showMenu (event, item) {
      const vueContextMenu = this.$refs.vueContextMenu;
      vueContextMenu.item = item;
      const menu = document.getElementById(vueContextMenu.elementId);
      if (!menu) {
        alert('No hay elemento');
        return;
      }

      // Obtener dimensiones del menú
      if (!vueContextMenu.menuWidth || !vueContextMenu.menuHeight) {
        menu.style.visibility = 'hidden';
        menu.style.display = 'block';
        vueContextMenu.menuWidth = menu.offsetWidth;
        vueContextMenu.menuHeight = menu.offsetHeight;
        menu.removeAttribute('style');
      }

      // Usar clientX/clientY para posición relativa al viewport
      const clickX = event.clientX;
      const clickY = event.clientY;
      const menuWidth = vueContextMenu.menuWidth;
      const menuHeight = vueContextMenu.menuHeight;

      // Calcular posición horizontal
      let posX;
      if (clickX + menuWidth >= window.innerWidth) {
        posX = clickX - menuWidth + 2;
      } else {
        posX = clickX - 2;
      }

      // Calcular posición vertical - verificar si hay espacio abajo o arriba
      let posY;
      const spaceBelow = window.innerHeight - clickY;
      const spaceAbove = clickY;

      if (spaceBelow >= menuHeight) {
        // Hay espacio abajo, mostrar debajo del cursor
        posY = clickY - 2;
      } else if (spaceAbove >= menuHeight) {
        // No hay espacio abajo pero sí arriba, mostrar encima
        posY = clickY - menuHeight + 2;
      } else {
        // No hay suficiente espacio en ningún lado, mostrar lo más arriba posible
        posY = Math.max(2, clickY - menuHeight + 2);
      }

      // Usar position fixed para evitar problemas de scroll
      menu.style.position = 'fixed';
      menu.style.left = posX + 'px';
      menu.style.top = posY + 'px';
      menu.classList.add('vue-simple-context-menu--active');
    },
    selection2Html (selection) {
      let html = '';
      if (selection.rangeCount) {
        const container = document.createElement('div');
        for (let i = 0, len = selection.rangeCount; i < len; ++i) {
          container.appendChild(selection.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
      return html;
    },
    optionClicked (event) {
      if (event.option.id === 1) {
        this.$emit('onCopyToNotes', this.html_selection);
      } else {
        this.showFlashCards = true;
        setTimeout(() => {
          this.$emit('onCopyToFlashCard', this.html_selection);
        }, 500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables/color-palette.scss';
.widthS {
  min-width: 600px;
}
</style>
