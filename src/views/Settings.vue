<template>
    <NavBar :showBackButton=true>
        <template #navbar-title>
            <p class="text-2xl font-light justify-self-start mt-6 ml-2">Configuración</p>
        </template>
    </NavBar>
    <div>
        <form class="mt-32" @submit.prevent="test">
        <label class="text-2xl font-light select-none" for="apikey">Open AI API KEY:</label><br>
        <input v-model="apiKey" type="text" id="apikey" name="apikey" class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>
        
        <label class="text-2xl font-light select-none" for="model">Default Model:</label><br>
        <select v-model="actualEngine" class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="model" id="model">
            <option value="ada">Ada</option>
            <option value="davinci">Davinci (Better for conversation)</option>
            <option value="davinci-instruct-beta-v3">Davinci Instructor Beta v3</option>
        </select>
        <br>
        <button class="mt-14 object-center transition duration-500 bg-blue-500 hover:bg-blue-400 active:bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" @click="deleteConversations()">
            Eliminar Conversaciónes
        </button> 
        <br>
        <button class="mt-1 object-center transition duration-500 bg-blue-500 hover:bg-blue-400 active:bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" @click="deleteContacts()">
            Eliminar Contactos
        </button> 
        <br>
        <button class="mt-1 object-center transition duration-500 bg-red-500 hover:bg-red-400 active:bg-red-500 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded" @click="deleteAllConfiguration()">
            Eliminar Todo
        </button> 
        </form>
    </div>
</template>
<script lang="ts">
import { watchEffect , ref } from 'vue'
import { openai } from '@/openai'
import { deleteAllConversations, deleteAllContacts, deleteAll } from '@/chat.ts'
import NavBar from '@/components/NavBar.vue'

export default {
    name:'Settings',
    components:{
        NavBar
    },
    // eslint-disable-next-line
    setup(){
        const apiKey = ref(openai.apiKey)
        const actualEngine = ref(openai.configuration.engine)

        const deleteConversations = () : void =>{
            deleteAllConversations()
        }

        const deleteContacts = () : void => {
            deleteAllContacts()
        }

        const deleteAllConfiguration = () : void => {
            deleteAll()
        }
        watchEffect(()=>{
            openai.setApiKey(apiKey.value)
            openai.saveConfiguration()
        })
        watchEffect(()=>{
            openai.setEngine(actualEngine.value)
            openai.saveConfiguration()
        })

        return {
            apiKey,
            actualEngine,

            deleteConversations,
            deleteContacts,
            deleteAllConfiguration
        }
    }
}
</script>