<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <div class="emoji">🗺️❓</div>
    <h1 class="oops">Oops! You’re off the map!</h1>
    <p>Looks like this page doesn’t exist. Maybe it's still being explored?</p>
    <n-button size="large" type="primary" @click="$router.push('/travels')">
      🧭 Take me back
    </n-button>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  min-height: 100vh;
  background-color: #fefefe;
}

.emoji {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.oops {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>
