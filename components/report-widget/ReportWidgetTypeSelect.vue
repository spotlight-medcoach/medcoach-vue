<template>
  <div class="rw-type">
    <p class="rw-type__heading">¿En qué podemos ayudarte?</p>
    <div class="rw-type__list">
      <button
        v-for="opt in options"
        :key="opt.type"
        class="rw-type__item"
        @click="$emit('selected', opt.type)"
      >
        <span class="rw-type__icon">{{ opt.emoji }}</span>
        <span class="rw-type__text">
          <span class="rw-type__title">{{ opt.title }}</span>
          <span class="rw-type__desc">{{ opt.desc }}</span>
        </span>
        <i class="fas fa-chevron-right rw-type__arrow" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportWidgetTypeSelect',
  data () {
    return {
      options: [
        {
          type: 'bug',
          emoji: '🐛',
          title: 'Reportar un error',
          desc: 'Dinos si algo no funciona',
        },
        {
          type: 'suggestion',
          emoji: '💡',
          title: 'Sugerir una mejora',
          desc: 'Comparte tus ideas con nosotros',
        },
        {
          type: 'feedback',
          emoji: '⭐',
          title: 'Retroalimentación',
          desc: 'Dinos qué te ha parecido MedCoach',
        },
      ],
    };
  },
};
</script>

<style scoped>
.rw-type__heading {
  font-size: 15px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 8px;
  padding: 0 4px;
}

.rw-type__list {
  display: flex;
  flex-direction: column;
}

.rw-type__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 4px;
  background: none;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.15s;
  border-radius: 6px;
}
.rw-type__item:last-child { border-bottom: none; }
.rw-type__item:hover { background: #fff8f0; }

.rw-type__icon {
  font-size: 26px;
  width: 38px;
  text-align: center;
  flex-shrink: 0;
}

.rw-type__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rw-type__title {
  font-size: 14px;
  font-weight: 700;
  color: #212529;
}

.rw-type__desc {
  font-size: 12px;
  color: #6c757d;
}

.rw-type__arrow {
  color: #adb5bd;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
