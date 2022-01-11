<template>
  <nav
    id="student-sidebar"
    :class="{
      'sidebar-active': sidebarActive
    }"
  >
    <!-- Dashboard -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/dashboard">
        <HomeIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Dashboard</span>
    </div>

    <!-- Calendario -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/calendar">
        <CalendarIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Calendario</span>
    </div>

    <!-- Manuales -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/manuals">
        <ManualsIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Manuales</span>
    </div>

    <!-- Notas -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/notes">
        <NotesIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Notas</span>
    </div>

    <!-- Flashcards -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/">
        <FlashcardIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Flashcards</span>
    </div>

    <!-- Exámenes -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/custom_test_config">
        <TestsIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Exámenes</span>
    </div>

    <!-- Análisis -->
    <div class="text-center nav-item-tooltip">
      <nuxt-link to="/">
        <InsightsIcon class="nav-icon" />
      </nuxt-link>
      <span class="nav-item-tooltip-text">Análisis</span>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from 'vuex'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import ManualsIcon from '@/components/icons/ManualsIcon.vue'
import NotesIcon from '@/components/icons/NotesIcon.vue'
import FlashcardIcon from '@/components/icons/FlashcardIcon.vue'
import InsightsIcon from '@/components/icons/InsightsIcon.vue'
import TestsIcon from '@/components/icons/TestsIcon.vue'
export default {
  components: {
    HomeIcon,
    CalendarIcon,
    ManualsIcon,
    NotesIcon,
    FlashcardIcon,
    InsightsIcon,
    TestsIcon
  },
  computed: {
    ...mapGetters({
      sidebarActive: 'sidebar/sidebarActive'
    })
  }
}
</script>
<style lang="scss">
  @import '@/assets/css/variables/_student_header_vars.scss';
  @import '@/assets/css/variables/_student_sidebar_vars.scss';
  #student-sidebar {
    -moz-transition: left 0.5s ease;
    border-right: 1px solid #E8E8E1;
    height: calc(100vh - #{$student-header-height});
    left: -#{$student-sidebar-width};
    padding-top: 30px;
    position: relative;
    top: 0;
    transition: left 0.5s ease;
    width: #{$student-sidebar-width};
  }
  .sidebar-active {
    left: 0 !important;
  }
</style>
