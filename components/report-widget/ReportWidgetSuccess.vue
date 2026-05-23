<template>
  <div class="rw-success">
    <i class="fas fa-check-circle rw-success__icon" />
    <p class="rw-success__title">¡Reporte enviado!</p>
    <p class="rw-success__msg">Gracias. Nuestro equipo revisará el problema.</p>
    <button class="rw-success__btn" @click="$emit('close')">Cerrar</button>
  </div>
</template>

<script>
export default { name: 'ReportWidgetSuccess' };
</script>

<style scoped>
.rw-success {
  text-align: center;
  padding: 16px 0;
}
.rw-success__icon {
  font-size: 48px;
  color: #28a745;
  display: block;
  margin-bottom: 12px;
}
.rw-success__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #212529;
}
.rw-success__msg {
  color: #555;
  font-size: 14px;
  margin-bottom: 20px;
}
.rw-success__btn {
  padding: 9px 24px;
  border: none;
  border-radius: 8px;
  background: #fe9400;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
.rw-success__btn:hover { background: #e07d00; }
</style>
