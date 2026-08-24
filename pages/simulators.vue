<template>
  <div class="redirecting">
    <p>Redirigiendo a los simuladores...</p>
  </div>
</template>
<script>
import { goToSimulatorsApp } from '@/helpers/simulatorsApp'

/**
 * La sección de simuladores vive ahora en la app externa de Next.js
 * (SIMULATORS_URL). Esta página queda solo para cubrir bookmarks y deep
 * links viejos: redirige de inmediato con el handoff de token.
 */
export default {
  layout: 'new_default',
  mounted () {
    goToSimulatorsApp()
  }
}
</script>
<style>
  .redirecting {
    margin: 60px;
    text-align: center;
    font-size: 18px;
  }
</style>
