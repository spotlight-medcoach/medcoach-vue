<template>
    <div :style="{'background-color':actualColorBg}">
  <b-navbar :style="{'background-color':`${actualColorBg} !important`, 'color':`${actualColorFont} !important`}" class="navbarBg" toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/dashboard"><img src="@/assets/home_logo_off.svg" width="50" height="50"/></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-button @click="onChangeFontSize" size="sm" class="btnLetterChange mr-2" type="submit">A</b-button>
          <b-button :style="{'background-color':actualColorBtn}" @click="onchangeColorBg" size="sm" class="btnColorChange mr-2" type="submit"/>
          <b-button size="sm" class="my-2 my-sm-0 finishManualBtn" type="submit" @click="finishManual">Finalizar Manual</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

  <b-container style="height: 90.4vh; max-width: 98vw;">
  <b-row class="mt-3">

    <b-col cols="8">
      <div :style="`font-size:${fontSize}em; color: ${actualColorFont}`" id="content" oncopy="return false" oncut="return false" onpaste="return false">
        <div v-html="manualHTML"/>
      </div>
      </b-col>
    <b-col>
      <client-only>
        <quill-editor
          ref="myQuillEditor"
          v-model="content"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        />
      </client-only>
    </b-col>
  </b-row>
</b-container>
  <b-modal id="modal-1" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>

</template>

<script>
export default {
  data () {
    return {
      manual_id: this.$route.query.manual_id,
      manualHTML: null,
      light: '#ffff',
      dark: '#000000',
      sepia: '#fff2b4',
      actualColorBg: '#ffffff',
      actualColorFont: '#000000',
      actualColorBtn: '#fff2b4',
      content: '',
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
      }
    }
  },
  created () {
    this.getManualHTML()
  },
  props: {
    // ...
  },
  methods: {
    finishManual () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.$axios
        .put('/students/syllabus', {
          manual_id: this.manual_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
        }).catch((err) => {
          console.log(err)
        })
    },

    getManualHTML () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.$axios
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

    },
    onEditorFocus (event) {

    },
    onEditorReady (event) {

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
    background-color: #fff;
}
#content img:hover {
   opacity: 0.5;
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
#tooltip{
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
.divTableCell {
  display: table-cell;
  padding: 3px 10px;
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

</style>
