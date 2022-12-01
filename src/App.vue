<template> 
  <ReloadPrompt />
    <div>
      <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
          </keep-alive>
      </router-view>
    </div>
</template>
<script>
import { onMounted } from 'vue'
// import { loadUserDataAndConfiguration } from './chat.ts'
import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  components:{
    ReloadPrompt
  },
  setup(){
    return {}
  }
}
</script>
<style>
html {
  scroll-behavior: smooth;
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
