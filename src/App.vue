<template>
  <ReloadPrompt />
  <div>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
<script>
import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  components: {
    ReloadPrompt
  },
  setup() {
    return {}
  }
}
</script>
<style>
html,
body {
  scroll-behavior: smooth;
  height: 100%;
  overflow: hidden;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Slide effect transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease-out;
}

.slide-enter-to {
  position: absolute;
  right: 0;
}

.slide-enter-from {
  position: absolute;
  right: -100%;
}

.slide-leave-to {
  position: absolute;
  left: -100%;
}

.slide-leave-from {
  position: absolute;
  left: 0;
}
</style>
