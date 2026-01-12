<template>
  <div
    id="manual-navbar"
    class="w-100 d-inline-flex justify-content-between align-items-center"
  >
    <!------------------------------------------------------------------------- LEFT CONTENT -->
    <b-skeleton-wrapper :loading="loading || !title">
      <template #loading>
        <div>
          <b-skeleton
            animation="throb"
            width="300px"
            height="30px"
            class="ml-2"
          />
        </div>
      </template>
      <div v-if="title" class="mx-3 body-title-1">
        {{ title }}
      </div>
    </b-skeleton-wrapper>
    <!------------------------------------------------------------------------- RIGHT CONTENT -->
    <div class="d-inline-flex align-items-center neutral-color-600">
      <!----------------------------------------------------------------- Cambiar brillo de vista -->
      <div class="mx-2 d-inline-flex align-items-center">
        <switch-brightness-button @onChangeBrightness="changeBrightness" />
      </div>
      <div class="v-divider" />
      <!----------------------------------------------------------------- Cambiar tamaño de letra -->
      <div class="mx-2 d-inline-flex align-items-center">
        <b-icon icon="dash" class="m-2 pointer" @click="changeFontSize(-1)" />
        <strong class="change-font-size-button">
          <small>A</small>
          <span>A</span>
        </strong>
        <b-icon icon="plus" class="m-2 pointer" @click="changeFontSize(1)" />
      </div>
      <!----------------------------------------------------------------- Marcar como aprendido -->
      <template v-if="phase.id !== 2">
        <div class="v-divider" />
        <div class="mx-2 d-inline-flex align-items-center">
          <holdable-button
            ref="finish-manual-button"
            message="Manten presionado para marcar como aprendido"
            :max-width="230"
            :default-value="!allowFinishManual"
            :disabled="isFreeTrial || !allowFinishManual"
            @onCheck="finishManual"
          />
        </div>
        <!-- <div class="v-divider" /> -->
      </template>
      <!----------------------------------------------------------------- Reportar manual -->
      <!-- <div class="mx-2 d-inline-flex align-items-center main-color">
				<b-icon
					align-v="center"
					icon="exclamation-triangle"
					class="h3 m-0 mx-2"
				/>
			</div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SwitchBrightnessButton from '@/components/_functional/switchBrightnessButton.vue';
import HoldableButton from '@/components/_functional/holdableButton.vue';
export default {
  components: {
    SwitchBrightnessButton,
    HoldableButton,
  },
  props: {
    manualId: {
      type: String,
      default: '',
    },
    allowFinishManual: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      fontSize: 1.2,
      manualInfo: null,
      loading: false,
    };
  },
  computed: {
    title () {
      // Usar la información del manual obtenida del endpoint
      if (this.manualInfo && this.manualInfo.name) {
        return this.manualInfo.name;
      }

      // Fallback: buscar en el array plano de manuals (más eficiente)
      if (
        this.manuals &&
        Array.isArray(this.manuals) &&
        this.manuals.length > 0
      ) {
        const manual = this.manuals.find((m) => {
          const manualId = m.manual_id ? m.manual_id.toString() : '';
          const searchId = this.manualId.toString();
          return manualId === searchId;
        });
        if (manual && manual.manual_name) {
          return manual.manual_name;
        }
      }

      // Fallback: buscar en la estructura de topics
      if (this.topics && Array.isArray(this.topics) && this.topics.length > 0) {
        let name = '';
        this.topics.some((topic) => {
          if (!topic || !topic.subtopics || !Array.isArray(topic.subtopics)) {
            return false;
          }
          return topic.subtopics.some((subtopic) => {
            if (
              !subtopic ||
              !subtopic.manuals ||
              !Array.isArray(subtopic.manuals)
            ) {
              return false;
            }
            return subtopic.manuals.some((manual) => {
              if (!manual || !manual.id) {
                return false;
              }
              const manualId = manual.id.toString();
              const searchId = this.manualId.toString();
              if (manualId === searchId) {
                name = manual.name || '';
                return true;
              }
              return false;
            });
          });
        });
        return name;
      }

      return '';
    },
    ...mapState({
      isFreeTrial: (state) => state.isFreeTrial,
      phase: (state) => state.phase,
      topics: (state) => state.topics.data,
      manuals: (state) => state.topics.manuals,
    }),
  },
  watch: {
    manualId: {
      immediate: true,
      handler (newId) {
        if (newId) {
          this.fetchManualInfo();
        } else {
          this.manualInfo = null;
        }
      },
    },
  },
  methods: {
    async fetchManualInfo () {
      if (!this.manualId) {
        return;
      }

      this.loading = true;
      try {
        const response = await this.$axios.get('/student/manuals/info', {
          params: {
            manual_id: this.manualId,
          },
        });
        if (response.data && response.data.data && response.data.data.manual) {
          this.manualInfo = response.data.data.manual;
          // Emitir evento con la información del manual para que el componente padre la use
          this.$emit('onManualInfoLoaded', this.manualInfo);
        }
      } catch (error) {
        console.error('Error fetching manual info:', error);
        // No mostrar error al usuario, usar fallback
      } finally {
        this.loading = false;
      }
    },
    changeFontSize (change) {
      const scale = 0.1;
      const fontSize = +parseFloat(change * scale + this.fontSize).toFixed(1);
      if (fontSize >= 1 && fontSize <= 1.4) {
        this.fontSize = fontSize;
        this.$emit('onChangeFontSize', this.fontSize);
      }
    },
    changeBrightness (brightness) {
      this.$emit('onChangeBrightness', brightness);
    },
    finishManual () {
      this.$emit('onFinishManual');
    },
    resetFinishManualButton () {
      this.$refs['finish-manual-button'].reset();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables/color-palette.scss';
#manual-navbar {
  height: 60px;
  small {
    font-size: 0.7em;
  }
  .bi-dash,
  .bi-plus {
    font-size: 1.4em;
    line-height: 2em;
  }
  .v-divider {
    border-right: 1px solid #{$neutral-600};
    height: 17px;
  }
}
</style>
