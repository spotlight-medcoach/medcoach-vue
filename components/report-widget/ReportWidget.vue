<template>
  <div>
    <!-- Tab y FAB se ocultan durante la captura, pero el panel nunca se desmonta -->
    <template v-if="visible">
      <button
        v-if="showTab"
        :class="['rw-tab', `rw-tab--${config.widget_tab_position}`]"
        @click="open('tab')"
      >
        <span>{{ config.widget_tab_text }}</span>
      </button>

      <button
        v-if="showFloating"
        :class="['rw-fab', `rw-fab--${position}`]"
        :title="config.widget_tab_text"
        @click="open('floating')"
      >
        <i class="fas fa-bug" />
      </button>
    </template>

    <ReportWidgetPanel
      v-if="panelOpen"
      :opened-from="openedFrom"
      :tab-position="config.widget_tab_position"
      :widget-position="position"
      @close="close"
    />
  </div>
</template>

<script>
import ReportWidgetPanel from './ReportWidgetPanel.vue';

const BASE_URL = (process.env.BASE_PATH && process.env.BASE_PATH.trim() !== '')
  ? process.env.BASE_PATH
  : 'https://1q66rzf5zl.execute-api.us-east-1.amazonaws.com/api';

const DEFAULT_CONFIG = {
  widget_mode: 'floating',
  widget_tab_text: 'Hacer un reporte',
  widget_tab_position: 'right',
};

export default {
  name: 'ReportWidget',
  components: { ReportWidgetPanel },
  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: (v) => ['bottom-right', 'bottom-left'].includes(v),
    },
  },
  data () {
    return {
      visible: true,
      panelOpen: false,
      openedFrom: 'floating',
      config: { ...DEFAULT_CONFIG },
    };
  },
  computed: {
    showTab () {
      return this.config.widget_mode === 'tab' || this.config.widget_mode === 'both';
    },
    showFloating () {
      return this.config.widget_mode === 'floating' || this.config.widget_mode === 'both';
    },
  },
  async created () {
    this.$root.$on('report-widget:hide', () => { this.visible = false; });
    this.$root.$on('report-widget:show', () => { this.visible = true; });
    await this.loadConfig();
  },
  beforeDestroy () {
    this.$root.$off('report-widget:hide');
    this.$root.$off('report-widget:show');
  },
  methods: {
    async loadConfig () {
      try {
        const res = await fetch(`${BASE_URL}/catalogues/widget-config`);
        if (res.ok) {
          const json = await res.json();
          this.config = { ...DEFAULT_CONFIG, ...json.data };
        }
      } catch (_) {
        // usa defaults si falla
      }
    },
    open (from) {
      this.openedFrom = from;
      this.panelOpen = true;
    },
    close () {
      this.panelOpen = false;
    },
  },
};
</script>

<style scoped>
/* ---- Tab lateral ---- */
.rw-tab {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  background: #fe9400;
  color: #fff;
  border: none;
  padding: 14px 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: .5px;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
  writing-mode: vertical-rl;
  transition: background .2s;
}
.rw-tab:hover { background: #e07d00; }

.rw-tab--right {
  right: 0;
  border-radius: 0 8px 8px 0;
  transform: translateY(-50%) rotate(180deg);
}
.rw-tab--left {
  left: 0;
  border-radius: 0 8px 8px 0;
}

/* ---- Botón flotante ---- */
.rw-fab {
  position: fixed;
  z-index: 9999;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fe9400;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .2s;
}
.rw-fab:hover { background: #e07d00; }
.rw-fab--bottom-right { right: 24px; }
.rw-fab--bottom-left  { left: 24px; }
</style>
