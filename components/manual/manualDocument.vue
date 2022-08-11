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
      >
        <div
          :style="{ width: '200' }"
          ref="manual-html"
          class="p-3 px-4"
          @contextmenu.prevent.stop="return true;"
          @mouseup.prevent.stop="
            handleMouseUp($event, { selection: my_window.getSelection() })
          "
          v-html="manualHTML"
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
import LoadingState from "@/components/LoadingState.vue";
export default {
  components: {
    LoadingState,
  },
  props: {
    manual_id: {
      type: String,
      default: undefined,
    },
    font_size: {
      type: Number,
      default: 1,
    },
    brightness: undefined,
  },
  watch: {
    async manual_id() {
      this.showLoading = true;
      await this.getManualHTML();
      this.showLoading = false;
    },
  },
  data() {
    return {
      showLoading: true,
      my_window: window,
      manualHTML: null,
      html_selection: "",
      selection: "",
      cursor_index: 0,
      showFlashCards: false,
      optionsMenu: [
        {
          name: "Crear Nota",
          slug: "crear-nota",
          class: "note-option",
          id: 1,
        },
        {
          name: "Crear Flashcard",
          slug: "crear-flashcard",
          class: "flashcard-option",
          id: 2,
        },
      ],
      message: "Cargando manual, por favor espere",
      message_error: "Ocurrió un error su petición",
      error_http: false,
    };
  },
  computed: {
    fontSize() {
      return this.font_size;
    },
    actualColorBg() {
      return this.brightness.background;
    },
    actualColorFont() {
      return this.brightness.font;
    },
    actualColorBtn() {
      return this.brightness.button;
    },
  },
  async created() {
    await this.getManualHTML();
    this.showLoading = false;
  },
  methods: {
    getManualHTML() {
      return this.$axios
        .get(`/manuals?manual_id=${this.manual_id}`)
        .then((res) => {
          this.manualHTML = res.data;
          this.$emit("onFetchedManual");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeFontSize(change) {
      const scale = 0.1;
      const fontSize = +parseFloat(change * scale + this.fontSize).toFixed(1);
      if (fontSize >= 1 && fontSize <= 1.4) {
        this.fontSize = fontSize;
      }
    },
    changeBrightness(brightnessState) {
      this.actualColorBg = brightnessState.background;
      this.actualColorBtn = brightnessState.button;
      this.actualColorFont = brightnessState.font;
    },
    handleMouseUp(event, item) {
      if (event.target.localName === "img") {
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");
        const captionText = document.getElementById("caption");
        modalImg.src = event.target.src;
        captionText.innerHTML = event.target.alt;
        modal.style.display = "block";
      }
      this.selection = item.selection.toString().trim();
      this.html_selection = this.selection2Html(item.selection);
      if (this.html_selection !== "") {
        setTimeout(() => {
          this.showMenu(event, item);
        }, 250);
      }
      this.html_selection += "<p><br></p>";
    },
    showMenu(event, item) {
      const vueContextMenu = this.$refs.vueContextMenu;
      vueContextMenu.item = item;
      const menu = document.getElementById(vueContextMenu.elementId);
      if (!menu) {
        alert("No hay elemento");
        return;
      }
      if (!vueContextMenu.menuWidth || !vueContextMenu.menuHeight) {
        menu.style.visibility = "hidden";
        menu.style.display = "block";
        vueContextMenu.menuWidth = menu.offsetWidth;
        vueContextMenu.menuHeight = menu.offsetHeight;
        menu.removeAttribute("style");
      }
      if (vueContextMenu.menuWidth + event.pageX >= window.innerWidth) {
        menu.style.left = event.pageX - vueContextMenu.menuWidth + 2 + "px";
      } else {
        menu.style.left = event.pageX - 2 + "px";
      }
      if (vueContextMenu.menuHeight + event.pageY >= window.innerHeight) {
        menu.style.top = event.pageY - vueContextMenu.menuHeight + 2 + "px";
      } else {
        menu.style.top = event.pageY - 2 + "px";
      }
      menu.classList.add("vue-simple-context-menu--active");
    },
    selection2Html(selection) {
      let html = "";
      if (selection.rangeCount) {
        const container = document.createElement("div");
        for (let i = 0, len = selection.rangeCount; i < len; ++i) {
          container.appendChild(selection.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
      return html;
    },
    optionClicked(event) {
      if (event.option.id === 1) {
        this.$emit("onCopyToNotes", this.html_selection);
      } else {
        this.showFlashCards = true;
        setTimeout(() => {
          this.$emit("onCopyToFlashCard", this.html_selection);
        }, 500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/variables/color-palette.scss";
</style>
