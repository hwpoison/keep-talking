<template>
<nav>
    <div
    class="fixed w-full bg-blue-500 h-20 rounded-b border-b-4 border-blue-600 text-white shadow-md select-none"
    style="top:0px; overscroll-behavior: none;">
        <div class="flex flex-wrap items-center mt-3">
            <div v-if="showBackButton" id="back-button" class="mt-4 hover:-translate-x-1" @click="backToContacts()">
                <svg class="mr-4 ml-1 fill-current transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
            </div>
            <div class="flex self-center">
                <slot name='navbar-content'/>
            </div>   
        </div>
        <div class="flex flex-wrap items-center justify-between pb-5 h-20 pr-6">
            <slot name='nav-bar-content'/>
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

        const backToContacts = () : void => {
            router.push('/')
        }
        return {
            backToContacts
        }
    }
}
</script>