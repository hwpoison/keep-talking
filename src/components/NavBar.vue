<template>
<nav>
    <div
    class="fixed w-full bg-blue-500 rounded-b border-b-4 border-blue-600 h-20 text-white shadow-md select-none"
    style="top:0px; overscroll-behavior: none;">
      <div class="flex">
            <div v-if="showBackButton" id="back-button" class="mt-1 hover:-translate-x-1 mt-3" @click="goBack()">
                <svg class="mt-4 ml-1 fill-current transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
            </div>
            <div style="white-space: nowrap;" class="grid grid-cols-1 w-full place-content-between">
              <div class="grid grid-rows-1 grid-cols-2">
                <!-- view title -->
                <slot name="navbar-title"/>
                <div class="self-center justify-self-end">
                    <!-- menu content at the top right -->
                    <slot name="navbar-content"/>
                </div>
              </div>
            </div>
      </div>
    </div>
</nav>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';

export default {
    name:'NavBar',
    props:{
        showBackButton : Boolean
    },
    // eslint-disable-next-line
    setup(){
        const router = useRouter();

        const goBack = () : void => {
            router.go(-1) // .push('/')
        }
        return {
            goBack
        }
    }
}
</script>