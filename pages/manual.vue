<template>
<div :style="{'background-color':actualColorBg}" id="manual">
  <!-- NAVBAR -->
  <b-navbar :style="{'background-color':`${actualColorBg} !important`, 'color':`${actualColorFont} !important`}" class="navbarBg" toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/dashboard"><img src="@/assets/icons/home_logo_off.svg" width="50" height="50"/></b-navbar-brand>
    <span class="ml-3 manual-title">{{ manual_name }}</span>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-button @click="onChangeFontSize" size="sm" class="btnLetterChange mr-2 d-flex justify-content-center align-items-center" type="submit" :style="`font-size:${fontSize}em;`">
            <div >A</div>
          </b-button>
          <b-button :style="{'background-color':actualColorBtn}" @click="onchangeColorBg" size="sm" class="btnColorChange mr-2" type="submit"/>
          <b-button
            size="sm"
            class="my-2 my-sm-0 finishManualBtn"
            type="submit"
            @click="finishManual"
            v-if="!showLoading && !finished && phase.id !== 2 && !finish_manual_extra">
            Finalizar Manual
          </b-button>
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
  <b-container style="max-width: 98vw;" v-else>
    <b-row class="mt-3">
      <b-col cols="8">
        <div
          :style="`font-size:${fontSize}em; color: ${actualColorFont}`"
          id="content"
          ref="content"
          oncopy="return false"
          oncut="return false"
          onpaste="return false">
          <div
            ref="manual-html"
            @contextmenu.prevent.stop="return true"
            @mouseup.prevent.stop="handleMouseUp($event, {selection: my_window.getSelection()})"
            v-html="manualHTML">
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
                    style="align-self: center;"
                  >
                    <img src="@/assets/icons/save.svg" width="35" @click="saveFlashcard">
                  </b-overlay>
                  <b-overlay
                    :show="false"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                  >
                    <img src="@/assets/icons/cancel.svg" width="35" class="ml-2" @click="closeFlashcard">
                  </b-overlay>
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
              <img src="@/assets/icons/flashcard_trigger.svg" height="50px">
            </div>
          </div>
        </div>
      </b-col>
      <b-col id="quill-notes">
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
              <img src="@/assets/icons/save.svg" width="30" @click="saveNote">
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
  <modal-image />
</div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import ModalImage from '@/components/ModalImage'
export default {
  components: {
    LoadingState,
    ModalImage
  },
  data () {
    return {
      my_window: window,
      manual_id: this.$route.query.manual_id,
      is_extra: (this.$route.query.extra === 'true'),
      finish_manual_extra: (this.$route.query.finishManualExtra === 'true'),
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
    console.clear()
    const manual = this.$refs['manual-html']
    const imgs = manual.querySelectorAll('img')
    console.log('imgs', imgs)
  },
  mounted () {
    window.toastr.options = {
      positionClass: 'toast-bottom-right'
    }
  },
  computed: {
    editor () {
      return this.$refs.noteQuillEditor.quill
    },
    manual_name () {
      let name = ''
      const manualID = this.manual_id
      this.topics.forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          subtopic.manuals.forEach((manual) => {
            if (manual.id === manualID) {
              name = manual.name
            }
          })
        })
      })
      return name
    },
    ...mapState({
      phase: state => state.phase,
      topics: state => state.topics.data
    })
  },
  methods: {
    finishManual () {
      if (this.content.trim() === '') {
        this.$toastr.error('Su nota está vacía', 'Error')
        return false
      }
      this.message = 'Finalizando manual, espere un momento'
      this.showLoading = true
      this.saveNote()
      this.$axios
        .put('/students/syllabus', {
          manual_id: this.manual_id,
          extra: this.is_extra
        })
        .then((res) => {
          console.log(res.data)
          this.$store.dispatch('fetchSyllabus')
          this.$router.push({ path: '/dashboard' })
        }).catch((err) => {
          this.error_http = true
          this.message_error = err.response.data.message
        })
    },
    getManualNote () {
      return this.$axios
        .get(`/manuals/note?manual_id=${this.manual_id}`)
        .then((res) => {
          this.editor.clipboard.dangerouslyPasteHTML(res.data.note)
          this.finished = res.data.finished
        }).catch((err) => {
          console.log(err)
        })
    },
    saveNote () {
      if (this.content.trim() === '') {
        this.$toastr.error('Su nota está vacía', 'Error')
        return false
      }
      const params = {
        manual_id: this.manual_id,
        body: this.content
      }
      this.savingNotes = true
      this.$axios
        .post('/manuals/note', params)
        .then((response) => {
          this.$toastr.success('Su nota se ha acualizado correctamente', '¡Éxito!')
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
        .post('/manuals/flashcard', params)
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
      return this.$axios
        .get(`/manuals?manual_id=${this.manual_id}`)

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
      this.fontSize = this.fontSize + 0.2
      if (this.fontSize >= 1.5) {
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
      if (event.target.localName === 'img') {
        const modal = document.getElementById('myModal')
        const modalImg = document.getElementById('img01')
        const captionText = document.getElementById('caption')
        modalImg.src = event.target.src
        captionText.innerHTML = event.target.alt
        modal.style.display = 'block'
      }
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
