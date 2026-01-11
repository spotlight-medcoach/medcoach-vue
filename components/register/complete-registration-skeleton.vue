<template>
  <div class="skeleton-container">
    <div class="text-center mb-32px">
      <div class="skeleton-title skeleton"></div>
    </div>

    <!-- Información personal skeleton -->
    <div class="mb-24px">
      <div class="skeleton-subtitle skeleton mb-3"></div>
      <b-row class="my-3">
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
      </b-row>
    </div>

    <!-- Perfil skeleton -->
    <div class="mb-24px">
      <div class="skeleton-subtitle skeleton mb-3"></div>
      <div class="skeleton-label skeleton mb-2"></div>
      <div class="skeleton-input skeleton mb-3"></div>
      <div class="skeleton-label skeleton mb-2"></div>
      <div class="skeleton-input skeleton mb-3"></div>
      <div class="skeleton-label skeleton mb-2"></div>
      <div class="skeleton-button skeleton mb-3"></div>
      <b-row class="my-3">
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
        <b-col>
          <div class="skeleton-label skeleton mb-2"></div>
          <div class="skeleton-input skeleton"></div>
        </b-col>
      </b-row>
    </div>

    <div class="skeleton-button-large skeleton"></div>
  </div>
</template>

<script>
export default {
  name: 'CompleteRegistrationSkeleton',
};
</script>

<style lang="scss" scoped>
/* Skeleton styles */
.skeleton-container {
  padding: 20px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  width: 250px;
  height: 36px;
  margin: 0 auto;
}

.skeleton-subtitle {
  width: 200px;
  height: 28px;
}

.skeleton-label {
  width: 120px;
  height: 16px;
}

.skeleton-input {
  width: 100%;
  height: 38px;
}

.skeleton-button {
  width: 150px;
  height: 38px;
}

.skeleton-button-large {
  width: 100%;
  height: 42px;
  margin-top: 20px;
}
</style>
