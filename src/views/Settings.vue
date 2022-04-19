<template>
<div class="absolute inset-0 flex flex-col">
    <NavBar :showBackButton=true>
        <template #navbar-title>
            <p class="text-2xl font-light justify-self-start ml-2 pt-6">Configuración</p>
        </template>
    </NavBar>
    <ConfirmDialog ref="dialog"></ConfirmDialog>
    <p style="color:red"> Provisory Settings </p>
    <div class="flex-1 pt-2 overflow-y-scroll">
        <label class="text-2xl font-light text-gray-500 select-none" for="username">Tu nombre:</label><br>
        <input v-model="inputUserName.name" type="text" id="username" name="username" class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>

        <label class="text-2xl font-light text-gray-500   select-none" for="apikey">Open AI API KEY:</label><br>
        <input v-model="inputApiKey" type="text" id="apikey" name="apikey" class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>
        
        <label class="text-2xl font-light text-gray-500   select-none" for="model">Modelo por defecto:</label><br>
        <select v-model="inputActualEngine" class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="model" id="model">
            <option v-for='(label, name, id) in allEngines' :value=label :key=id >{{ name }}</option>
        </select>
        <br>
        <div v-for="label, name, id in allEngines" :key=id>
        </div>
        <button class="mt-8 object-center transition duration-500 bg-blue-500 hover:bg-blue-400 active:bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" @click="deleteConversations()">
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
        <br>
        <br>
    </div>
</div>
</template>
<script lang="ts">
import { watchEffect ,ref } from 'vue'

import { openai } from '../openai/openai'
import { allEngines as engines } from '../openai/engines'
import { saveUserInfo, getUserInfo, deleteAllConversations, deleteAllContacts, deleteAll } from '../chat'

import NavBar from '../components/NavBar.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
    name:'Settings',
    components:{
        NavBar,
        ConfirmDialog
    },
    setup(){
        const inputApiKey = ref(openai.apiKey)
        const inputActualEngine = ref(openai.configuration.engine)
        const inputUserName = ref(getUserInfo())
        const dialog = ref(null)
        const allEngines = engines

        const deleteConversations = () : void =>{
            dialog.value.show = true
            let confirmDeletion = {
                title:'¿Eliminar Conversaciónes?',
                message: 'Todas las conversaciones serán eliminadas.',
                onaccept: () => {deleteAllConversations();dialog.value.show=false}
            }
            Object.assign(dialog.value.settings, confirmDeletion)
        }

        const deleteContacts = () : void => {
            dialog.value.show = true
            let confirmDeletion = {
                title:'¿Eliminar contactos?',
                message: 'Todos los contactos serán eliminados.',
                onaccept: () => {deleteAllContacts();dialog.value.show=false}
            }
            Object.assign(dialog.value.settings, confirmDeletion)
        }

        const deleteAllConfiguration = () : void => {
            dialog.value.show = true
            let confirmDeletion = {
                title:'¿Eliminar toda la configuración?',
                message: 'Toda la configuración será eliminada, incluido contactos e historiales.',
                onaccept: () => {deleteAll();dialog.value.show=false}
            }
            Object.assign(dialog.value.settings, confirmDeletion)
        }

        watchEffect(()=>{
            openai.setApiKey(inputApiKey.value)
            openai.saveConfiguration()
        })
        watchEffect(()=>{
            openai.setEngine(inputActualEngine.value)
            openai.saveConfiguration()
        })

        watchEffect(()=>{
            // avoid empty name
            if(inputUserName.value.name==''){
                inputUserName.value.name = 'Persona'
            }
            saveUserInfo()
        })
        
        return {
            inputUserName,
            inputApiKey,
            inputActualEngine,

            deleteConversations,
            deleteContacts,
            deleteAllConfiguration,

            dialog,
            allEngines
        }
    }
}
</script>