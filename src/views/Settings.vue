<template>
<div class="absolute inset-0 flex flex-col">
    <NavBar :showBackButton="true">
        <template #navbar-title>
            <p class="text-2xl font-light justify-self-start ml-2 pt-6">{{ text.settings }}</p>
        </template>
    </NavBar>
    <ConfirmDialog ref="dialog"></ConfirmDialog>
    <div class="flex-1 pt-2 overflow-y-scroll">
        <label class="text-2xl font-light text-gray-500 select-none" for="username">{{ text.user }}:</label><br>
        <input v-model="inputUserName" type="text" id="username" name="username" class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>

        <label class="text-2xl font-light text-gray-500 select-none" for="apikey">{{ text.openAIKey }}:</label><br>
        <input v-model="inputApiKey" type="text" id="apikey" name="apikey" class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>
        
        <label class="text-2xl font-light text-gray-500 select-none" for="baseurl">API Endpoint:</label><br>
        <input v-model="inputBaseURL" type="text" id="baseurl" name="baseurl" class="font-monospace p-3 w-4/5 h-12 border border-b-4" placeholder="https://api.openai.com/v1"><br><br>
        
        <label class="text-2xl font-light text-gray-500 select-none" for="model">{{ text.defaultModel }}</label><br>
        <input v-model="inputActualEngine" list="engines-list" class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="model" id="model" placeholder="gpt-4o">
        <datalist id="engines-list">
            <option v-for="(label, name) in allEngines" :value="label" :key="label">{{ name }}</option>
        </datalist>
        <br><br>
        
        <label class="text-2xl font-light text-gray-500 select-none" for="lang">{{ text.selectLang }}</label><br>
        <select v-model="defaultLang" class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="lang" id="lang">
            <option v-for="(val, label) in allLanguages" :value="val" :key="val">{{ label }}</option>
        </select>
        <br>
        
        <div class="mt-4 flex items-center justify-center">
            <input v-model="inputShowReasoning" type="checkbox" id="reasoning" class="mr-2 h-6 w-6">
            <label class="text-2xl font-light text-gray-500 select-none" for="reasoning">{{ text.reasoningSupport }}</label>
        </div>
        <br>
        
        <div class="flex flex-col gap-2 items-center">
            <button class="transition duration-500 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-500 text-white font-bold py-2 px-4 border-b-4 border-cyan-700 hover:border-cyan-600 rounded w-64" @click="deleteConversations()">
                {{ text.deleteAllChats }}
            </button> 
            <button class="transition duration-500 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-500 text-white font-bold py-2 px-4 border-b-4 border-cyan-700 hover:border-cyan-600 rounded w-64" @click="deleteContacts()">
                {{ text.deleteAllContacts }}
            </button> 
            <button class="transition duration-500 bg-red-500 hover:bg-red-400 active:bg-red-500 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-64" @click="deleteAllConfiguration()">
                {{ text.deleteAll }}
            </button> 
        </div>
        <br><br>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { openai } from '../openai/openai';
import { allEngines as engines } from '../openai/engines';
import { setLang, text } from "../services/language";
import chat from '../services/chat';
import contacts from '../services/contacts';
import settings from '../services/settings';
import NavBar from '../components/NavBar.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

export default defineComponent({
    name: 'Settings',
    components: {
        NavBar,
        ConfirmDialog
    },
    setup() {
        const inputApiKey = ref(openai.apiKey);
        const inputBaseURL = ref(openai.baseURL || '');
        const inputActualEngine = ref(openai.configuration.engine);
        const inputShowReasoning = ref(openai.configuration.showReasoning);
        const inputUserName = ref(settings.userName.get());
        const defaultLang = ref(settings.language.get());
        const dialog = ref<any>(null);
        
        const allEngines = engines;
        const allLanguages = { "Español": "spanish", "English": "english" };
        
        const deleteConversations = (): void => {
            dialog.value.show = true;
            dialog.value.settings = {
                title: text.deleteAllChats,
                message: text.deleteAllChats, // Generic message
                onaccept: () => {
                    chat.deleteAllConversations();
                    dialog.value.show = false;
                }
            };
        };

        const deleteContacts = (): void => {
            dialog.value.show = true;
            dialog.value.settings = {
                title: text.deleteAllContacts,
                message: text.deleteAllContacts,
                onaccept: () => {
                    contacts.deleteAllContacts();
                    dialog.value.show = false;
                }
            };
        };

        const deleteAllConfiguration = (): void => {
            dialog.value.show = true;
            dialog.value.settings = {
                title: text.deleteAll,
                message: text.deleteAll,
                onaccept: () => {
                    chat.deleteAllConversations();
                    contacts.deleteAllContacts();
                    chat.saveHistory();
                    contacts.saveList();
                    dialog.value.show = false;
                }
            };
        };

        watchEffect(() => {
            openai.setApiKey(inputApiKey.value);
            openai.setBaseURL(inputBaseURL.value);
            openai.setReasoning(inputShowReasoning.value);
            openai.setEngine(inputActualEngine.value);
            openai.saveConfiguration();
            
            setLang(defaultLang.value);
            settings.language.set(defaultLang.value);
            
            const name = inputUserName.value.trim() || "Usuario";
            settings.userName.set(name);
            settings.saveSettings();
        });
        
        return {
            inputUserName, inputApiKey, inputBaseURL, inputActualEngine,
            inputShowReasoning, deleteConversations, deleteContacts,
            deleteAllConfiguration, defaultLang, dialog, allEngines,
            allLanguages, text
        };
    }
});
</script>