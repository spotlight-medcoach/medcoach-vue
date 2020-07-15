<template>
<div :style="{'background-color':actualColorBg}" id="manual">
  <!-- NAVBAR -->
  <b-navbar :style="{'background-color':`${actualColorBg} !important`, 'color':`${actualColorFont} !important`}" class="navbarBg" toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/dashboard"><img src="@/assets/home_logo_off.svg" width="50" height="50"/></b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-button @click="onChangeFontSize" size="sm" class="btnLetterChange mr-2" type="submit">A</b-button>
          <b-button :style="{'background-color':actualColorBtn}" @click="onchangeColorBg" size="sm" class="btnColorChange mr-2" type="submit"/>
          <b-button size="sm" class="my-2 my-sm-0 finishManualBtn" type="submit" @click="finishManual" v-show="!showLoading && !finished">Finalizar Manual</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <!-- Loading State -->
  <div v-if="showLoading" id="loading-state" class="d-flex align-items-center justify-content-center" style="height: 85vh">
    <loading-state :message="message" v-if="!error_http"/>
    <div style="font-size: 28px;" v-else>
      {{message_error}}
    </div>
  </div>
  <!-- CONTAINER -->
  <b-container style="height: 90.4vh; max-width: 98vw;" v-else>
    <b-row class="mt-3">
      <b-col cols="8">
        <div :style="`font-size:${fontSize}em; color: ${actualColorFont}`" id="content" oncopy="return false" oncut="return false" onpaste="return false">
          <div @contextmenu.prevent.stop="return true" @mouseup.prevent.stop="handleMouseUp($event, {selection: my_window.getSelection()})" v-html="manualHTML">
          </div>
          <div class="flashcards-edit">
            <transition name="slide-fade">
              <div v-if="showFlashCards">
                <div class="controls d-flex justify-content-end pr-4 pb-4">
                  <b-overlay
                    :show="savingFlashcard"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                  >
                    <img src="@/assets/save.svg" width="35" @click="saveFlashcard">
                  </b-overlay>
                  <img src="@/assets/cancel.svg" width="35" class="ml-2" @click="closeFlashcard">
                </div>
                <div class="editors">
                  <div class="labels-editors d-flex justify-content-between">
                    <div>Frente</div>
                    <div>Detrás</div>
                  </div>
                  <div class="content-editors d-flex">
                    <quill-editor
                      class="flashA"
                      ref="flashAQuillEditor"
                      v-model="flashA"
                      :options="editorOption"
                    />
                    <div class="division"></div>
                    <quill-editor
                      class="flashB"
                      ref="flashBQuillEditor"
                      v-model="flashB"
                      :options="editorOption"
                    />
                  </div>
                </div>
              </div>
            </transition>
            <div class="trigger" @click="showFlashCards = !showFlashCards">
              <img src="@/assets/flashcard_trigger.svg" height="50px">
            </div>
          </div>
        </div>
      </b-col>
      <b-col>
        <client-only>
          <div class="save-note">
            <b-overlay
              :show="savingNotes"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <img src="@/assets/save.svg" width="30" @click="saveNote">
            </b-overlay>
          </div>
          <quill-editor
            ref="noteQuillEditor"
            v-model="content"
            :options="editorOption"
            @blur="onEditorBlur($event)"
          />
        </client-only>
      </b-col>
    </b-row>
  </b-container>
  <!-- CONTEXT MENU -->
  <vue-simple-context-menu
      :elementId="'contextMenu'"
      :options="optionsMenu"
      :ref="'vueContextMenu'"
      @option-clicked="optionClicked"
    >
  </vue-simple-context-menu>
</div>
</template>

<script>
import LoadingState from '@/components/LoadingState.vue'
export default {
  components: {
    LoadingState
  },
  data () {
    return {
      my_window: window,
      manual_id: this.$route.query.manual_id,
      manualHTML: null,
      light: '#ffff',
      dark: '#000000',
      sepia: '#fff2b4',
      actualColorBg: '#ffffff',
      actualColorFont: '#000000',
      actualColorBtn: '#fff2b4',
      content: 'Cargando notas...',
      fontSize: 1,
      selectedImage: '',
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
                { background: ['#FE9400', '#FFFFFF', '#FFFF00'] }
              ]
            ]
          }
        }
      },
      optionsMenu: [
        {
          name: 'Crear Nota',
          slug: 'crear-nota',
          class: 'note-option',
          id: 1
        },
        {
          name: 'Crear flashcard',
          slug: 'crear-flashcard',
          class: 'flashcard-option',
          id: 2
        }
      ],
      html_selection: '',
      selection: '',
      cursor_index: 0,
      flashA: '',
      flashB: '',
      showFlashCards: false,
      showLoading: true,
      message: 'Cargando manual, por favor espere',
      savingFlashcard: false,
      message_error: 'Ocurrió un error su petición',
      error_http: false,
      finished: true,
      savingNotes: false
    }
  },
  async created () {
    await this.getManualHTML()
    this.showLoading = false
    await this.getManualNote()
  },
  mounted () {
    window.toastr.options = {
      positionClass: 'toast-bottom-right'
    }
  },
  computed: {
    editor () {
      return this.$refs.noteQuillEditor.quill
    }
  },
  methods: {
    finishManual () {
      this.message = 'Finalizando manual, espere un momento'
      this.showLoading = true
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.saveNote()
      this.$axios
        .put('/students/syllabus', {
          manual_id: this.manual_id,
          review: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
          this.$router.push({ path: '/dashboard' })
        }).catch((err) => {
          this.error_http = true
          this.message_error = err.response.data.message
        })
    },
    getManualNote () {
      return this.$axios
        .get(`/manuals/note?manual_id=${this.manual_id}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((res) => {
          this.editor.clipboard.dangerouslyPasteHTML(res.data.note)
          this.finished = res.data.finished
        }).catch((err) => {
          console.log(err)
        })
    },
    saveNote () {
      const params = {
        manual_id: this.manual_id,
        body: this.content
      }
      this.savingNotes = true
      this.$axios
        .post('/manuals/note', params,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.error(error)
          this.$toastr.error('Hubo un problema al guardar su nota', 'Error')
        })
        .finally(() => {
          this.savingNotes = false
        })
    },
    saveFlashcard () {
      if (this.flashA.trim() === '') {
        this.$toastr.error('Debes introducir el contenido de la parte frontal de la flashcard', 'Error')
        return false
      }
      if (this.flashB.trim() === '') {
        this.$toastr.error('Debes introducir el contenido de la parte trasera de la flashcard', 'Error')
        return false
      }
      this.savingFlashcard = true
      const params = {
        manual_id: this.manual_id,
        body_note: this.flashA,
        body_user: this.flashB
      }
      this.$axios
        .post('/manuals/flashcard', params,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((response) => {
          this.$toastr.success('Flashcard guardada correctamente', '¡Éxito!')
          this.closeFlashcard()
        })
        .catch((error) => {
          this.$toastr.error('Error al guardar la flashcard', 'Error')
          console.error(error)
        })
        .finally(() => {
          this.savingFlashcard = false
        })
    },
    getManualHTML () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      return this.$axios
        .get(`/manuals?manual_id=${this.manual_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((res) => {
          this.manualHTML = res.data
        }).catch((err) => {
          console.log(err)
        })
    },
    onchangeColorBg () {
      if (this.actualColorBg === '#ffffff') {
        this.actualColorBg = '#fff2b4'
        this.actualColorBtn = '#000000'
        this.actualColorFont = '#000000'
      } else if (this.actualColorBg === '#fff2b4') {
        this.actualColorBg = '#000000'
        this.actualColorBtn = '#ffffff'
        this.actualColorFont = '#ffffff'
      } else if (this.actualColorBg === '#000000') {
        this.actualColorBg = '#ffffff'
        this.actualColorBtn = '#fff2b4'
        this.actualColorFont = '#000000'
      }
    },
    onChangeFontSize () {
      this.fontSize = this.fontSize + 0.1
      if (this.fontSize >= 1.3) {
        this.fontSize = 1
      }
    },
    onEditorBlur (event) {
      this.cursor_index = event.selection.savedRange.index
      this.cursor_index = event.getLength()
      // this.saveNote()
    },
    copyText () {
      this.editor.clipboard.dangerouslyPasteHTML(this.cursor_index, this.html_selection)
    },
    handleMouseUp (event, item) {
      console.log('event', event)
      console.log('item', item)
      this.selection = item.selection.toString().trim()
      this.html_selection = this.selection2Html(item.selection)
      if (this.html_selection !== '') {
        setTimeout(() => {
          this.showMenu(event, item)
        }, 250)
      }
      this.html_selection += '<p><br></p>'
    },
    showMenu (event, item) {
      const vueContextMenu = this.$refs.vueContextMenu
      vueContextMenu.item = item
      const menu = document.getElementById(vueContextMenu.elementId)
      if (!menu) {
        alert('No hay elemento')
        return
      }
      if (!vueContextMenu.menuWidth || !vueContextMenu.menuHeight) {
        menu.style.visibility = 'hidden'
        menu.style.display = 'block'
        vueContextMenu.menuWidth = menu.offsetWidth
        vueContextMenu.menuHeight = menu.offsetHeight
        menu.removeAttribute('style')
      }
      if ((vueContextMenu.menuWidth + event.pageX) >= window.innerWidth) {
        menu.style.left = (event.pageX - vueContextMenu.menuWidth + 2) + 'px'
      } else {
        menu.style.left = (event.pageX - 2) + 'px'
      }
      if ((vueContextMenu.menuHeight + event.pageY) >= window.innerHeight) {
        menu.style.top = (event.pageY - vueContextMenu.menuHeight + 2) + 'px'
      } else {
        menu.style.top = (event.pageY - 2) + 'px'
      }
      menu.classList.add('vue-simple-context-menu--active')
    },
    optionClicked (event) {
      if (event.option.id === 1) {
        this.copyText()
      } else {
        this.showFlashCards = true
        setTimeout(() => {
          this.$refs.flashBQuillEditor.quill.clipboard.dangerouslyPasteHTML(this.html_selection)
        }, 500)
      }
    },
    selection2Html (selection) {
      let html = ''
      if (selection.rangeCount) {
        const container = document.createElement('div')
        for (let i = 0, len = selection.rangeCount; i < len; ++i) {
          container.appendChild(selection.getRangeAt(i).cloneContents())
        }
        html = container.innerHTML
      }
      console.log('html', html)
      return html
    },
    handlerPrevent () {
      return false
    },
    closeFlashcard () {
      this.flashA = ''
      this.flashB = '<p></p>'
      this.showFlashCards = false
    }
  }
}
</script>

<style>
.navbarBg{
    border-bottom: 1px solid black;
}
.finishManualBtn{
    width:350px;
    height:35px;
    background-color: #20B000;
    border: none;
    border-radius: 10px;
}
.btnColorChange{
    height:50px;
    width: 50px;
    border-radius: 50%;
    border:3px solid #5F5F5F;
}
.btnLetterChange{
    height:50px;
    width: 50px;
    background-color: #5F5F5F;
    border-radius: 50%;
    font-size: 25px;
}

.my-sm-0 {
  margin-top: 6px !important;
}

@media print {
    html, body {
       display: none;  /* hide whole page */
    }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #FD9326;
  border-radius: 10px;
}

#content {
  text-align: initial;
  overflow-y:scroll;
  height: 85vh;
  overflow-x: hidden;
  width: 100%;
}
#content img {
  cursor: pointer;
  background-color: transparent;
  border-radius: 50px;
}
#content img:hover {
  /* opacity: 0.7; */
  border: 3px solid darkorange;
}
.dark {
  color: #FFFFFF!important;
}
.light {
  color: #000000;
}
.textBoxDark {
  background-color: #487a94!important;
}
.quill-editor {
  background-color: #FCFCFC;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  min-height: 85vh;
  border-radius: 8px;
}
.ql-editor {
  min-height: 80vh;
}
.ql-toolbar {
   border-top: none!important;
   border-left: none!important;
   border-right: none!important;
   border-bottom: 1px solid #000!important;
   margin-left: 24px;
   margin-right: 24px;
}
.ql-formats {
   margin-right: 0px!important;
}
.ql-container {
   border: none!important;
   margin-left: 10px!important;
   margin-right: 10px!important;
}
.Popup .ql-toolbar {
   position: absolute;
   bottom: 0;
   border-bottom: 0!important;
   border-top: 1px solid #000!important;
   opacity: 0;
   transition: all ease 0.8s;
   width: 87%!important;
}
.o-hide {
  opacity: 1!important;
}
.Popup .ql-container {
   height: 88%!important;
}
.ql-picker-options {
   top: -110%!important;
   width: 75px!important;
}
::selection
{
    background:rgba(254, 148, 0, 0.15);
}
::-moz-selection{
    background: rgba(254, 148, 0, 0.15);
}
#tooltip {
    position:absolute;
    display:none;
    border:grey solid 1px;
    background:white;
}
#cal1{
    position:absolute;
    height:0px;
    width:0px;
    top:100px;
    left:100px;
    overflow:none;
    z-index:-100;
}
#cal2{
    position:absolute;
    height:0px;
    width:0px;
    top:0px;
    left:0px;
    overflow:none;
    z-index:-100;
}
#button_copy{
  color: #4A4A4A;
  border:none;
  background-color: #FFFFFF;
  margin: 0;
  top: 50%;
  left: 50%;
  font-family: Montserrat;
  font-size: 14px;
  cursor: pointer;
}
#button_flashcard{
  color: #4A4A4A;
  border:none;
  background-color: #FFFFFF;
  margin: 0;
  top: 50%;
  left: 50%;
  font-family: Montserrat;
  font-size: 14px;
  cursor: pointer;
}
#contextMenu{
  position:absolute;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 20px;
  border-width: 100%;
  width: 255px;
  height: 40px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.vue-simple-context-menu--active {
  display: flex;
}
.note-option{
  margin-top: 0px !important;
  border-radius: 20px;
}
.flashcard-option{
  margin-bottom: 0px !important;
  border-radius: 20px;
  margin-left: 0.6rem !important;
}
.divTableCell1{
  border-right: 1px solid #EAEAEA;
  display: table-cell;
  padding: 3px 10px;
}
.divTableBody {
  display: table-row-group;
  position: absolute;
  top: 18%;
}
.Popup img:hover {
  opacity: 1!important;
}
.flashcards-edit {
  position: sticky;
  bottom: 2px;
  width: 100%
}
.trigger {
  text-align: center;
  width: 97%;
  margin: auto;
}
.trigger img {
  opacity: 0.5;
}
.trigger img:hover {
  opacity: 1;
  border: none !important;
}
.editors {
  min-height: 90px;
  max-height: 165px;
  height: auto;
  width: 97%;
  background-color: white;
  border-radius: 16px;
  margin: 0px auto 10px auto;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
}
.labels-editors {
  font-size: 13px;
  padding: 7px 15px 0px 15px;
  font-weight: bold;
}
.content-editors {
  height: inherit;
  width: 100%;
}
.flashA {
  width: 49%;
  margin-left: 1%;
}
.flashB {
}
.division {
  height: auto;
  margin-bottom: 14px;
  border: thin solid black;
}
.editors .quill-editor {
  border-radius: 0px;
  box-shadow: none;
  background-color: white;
  height: auto;
  max-height: 133px;
  min-height: 60px;
  margin-top: 3px;
  width: 49%;
  display: flex;
  flex-wrap: wrap !important;
  align-content: center;
}
.editors .ql-container {
  min-height: 20px !important;
  max-height: 100px !important;
  height: auto;
  order: 1;
  width: 100%;
  margin-bottom: 2px;
}
.editors .ql-editor {
  min-height: 20px !important;
  max-height: 100px !important;
  height: auto;
  padding: 0px 15px !important;
  width: 96%;
}
.ql-editor p {
  margin-top: 2px;
}
.editors .ql-toolbar {
  order: 2;
  border-bottom: none !important;
  border-top: 1px solid #000 !important;
  width: 100%;
  padding: 0px 8px !important;
}
#manual .ql-toolbar {
  display: flex !important;
  justify-content: center !important;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(150px);
  opacity: 0;
}
.save-note {
  position: absolute;
  left: 42px;
  top: 7px;
  cursor: pointer;
}
</style>
