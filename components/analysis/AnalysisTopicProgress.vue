<template>
  <div class="analytics-card detail-card">
    <h3 class="detail-card__title">Progreso por Bloque</h3>
    <div class="category-list">
      <div
        v-for="(topic, idx) in topManualsByTopic"
        :key="topic.topic_id || topic.topic_name"
        class="category-item"
      >
        <div class="category-item__header">
          <span class="category-item__name">{{ topic.topic_name }}</span>
          <span class="category-item__pct" :style="{ color: categoryColor(idx) }">
            {{ topic.read_count }}/{{ topic.total_count }}
            <span class="category-item__pct-small">({{ topic.coverage_pct }}%)</span>
          </span>
        </div>
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :style="{ width: topic.coverage_pct + '%', background: categoryColor(idx) }"
          />
        </div>
      </div>
      <p v-if="!topManualsByTopic.length" class="empty-text mb-0">
        Aún no hay manuales leídos.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AnalysisTopicProgress',
  computed: {
    ...mapGetters({
      manualsByTopic: 'student_analytics/manualsByTopic',
    }),
    topManualsByTopic () {
      return this.manualsByTopic || [];
    },
  },
  methods: {
    categoryColor (idx) {
      const palette = ['#FF9300', '#818FF9', '#3FB97A', '#FFC145', '#57CCF2', '#AE8CFB'];
      return palette[idx % palette.length];
    },
  },
};
</script>

<style lang="scss" scoped>
.analytics-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}
.detail-card__title {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 16px;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.category-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.category-item__name {
  font-size: 13px;
  font-weight: 600;
  color: #3a3a3a;
}
.category-item__pct {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.category-item__pct-small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.75;
}
.progress-bar-track {
  width: 100%;
  height: 8px;
  background: #f1f1ed;
  border-radius: 99px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}
.empty-text {
  font-size: 13px;
  color: #9a9a9a;
}
</style>
