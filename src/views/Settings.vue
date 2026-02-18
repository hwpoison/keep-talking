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
            <input v-model="inputUserName" type="text" id="username" name="username"
                class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>
            <label class="text-2xl font-light text-gray-500 select-none" for="openai.configuration.apiKey">{{
                text.openAIKey
                }}:</label><br>
            <input v-model="openai.configuration.apiKey" type="text" id="apikey" name="apikey"
                class="font-monospace p-3 w-4/5 h-12 border border-b-4"><br><br>
            <label class="text-2xl font-light text-gray-500 select-none" for="openai.configuration.baseURL">{{
                text.apiEndpoint
                }}:</label><br>
            <input v-model="openai.configuration.baseURL" type="text" id="baseurl" name="baseurl"
                class="font-monospace p-3 w-4/5 h-12 border border-b-4"
                :placeholder="text.apiBaseUrlPlaceholder"><br><br>

            <label class="text-2xl font-light text-gray-500 select-none" for="model">{{ text.defaultModel }}</label><br>
            <input v-model="openai.configuration.model" list="engines-list"
                class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="model" id="model"
                :placeholder="text.apiModelPlaceholder">
            <datalist id="engines-list">
                <option v-for="(label, name) in allModels" :value="label" :key="label">{{ name }}</option>
            </datalist>
            <br><br>

            <label class="text-2xl font-light text-gray-500 select-none" for="lang">{{ text.selectLang }}</label><br>
            <select v-model="defaultLang" class="font-monospace p-3 w-4/5 h-12 border border-b-4" name="lang" id="lang">
                <option v-for="(val, label) in languages" :value="val" :key="val">{{ label }}</option>
            </select>
            <br><br>

            <label class="text-2xl font-light text-gray-500 select-none" for="lang">{{ text.creativity }}</label><br>
            <select v-model="openai.configuration.temperature" class="font-monospace p-3 w-4/5 h-12 border border-b-4"
                name="lang" id="lang">
                <option v-for="(val, label) in temperatures" :value="Number(val)" :key="val">{{ label }}</option>
            </select>
            <br>
            <br>

            <div class="mt-4 flex items-center justify-center">
                <input v-model="openai.configuration.showReasoning" type="checkbox" id="reasoning" class="mr-2 h-6 w-6">
                <label class="text-2xl font-light text-gray-500 select-none" for="reasoning">{{ text.reasoningSupport
                    }}</label>
            </div>
            <br>

            <div class="flex flex-col gap-2 items-center">
                <button
                    class="transition duration-500 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-500 text-white font-bold py-2 px-4 border-b-4 border-cyan-700 hover:border-cyan-600 rounded w-64"
                    @click="restoreDefaultContacts()">
                    {{ text.restoreDefaultContacts }}
                </button>
                <button
                    class="transition duration-500 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-500 text-white font-bold py-2 px-4 border-b-4 border-cyan-700 hover:border-cyan-600 rounded w-64"
                    @click="deleteConversations()">
                    {{ text.deleteAllChats }}
                </button>
                <button
                    class="transition duration-500 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-500 text-white font-bold py-2 px-4 border-b-4 border-cyan-700 hover:border-cyan-600 rounded w-64"
                    @click="deleteContacts()">
                    {{ text.deleteAllContacts }}
                </button>
                <button
                    class="transition duration-500 bg-red-500 hover:bg-red-400 active:bg-red-500 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-64"
                    @click="deleteAllConfiguration()">
                    {{ text.deleteAll }}
                </button>
            </div>
            <br><br>
        </div>
    </div>
</template>

<script lang="ts">
import { watch, defineComponent, ref, watchEffect } from 'vue';
import { openai } from '../openai/openai';
import { allModels } from '../openai/models';
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
        const inputUserName = ref(settings.userName.get());
        const defaultLang = ref(settings.language.get());
        const dialog = ref<any>(null);
        const languages = { "Español": "spanish", "English": "english" };
        const temperatures = {
            [text.verycreative]: 1.0,
            [text.creative]: 0.7,
            [text.neutral]: 0.2,
            [text.deterministic]: 0.0
        }; // will not mutate

        const deleteConversations = (): void => {
            dialog.value.show = true;
            Object.assign(dialog.value.settings, {
                title: text.deleteAllChats,
                message: text.areYouSure,
                confirmationLabel: text.confirm,
                abortLabel: text.close,
                onaccept: () => {
                    chat.deleteAllConversations();
                    dialog.value.show = false;
                },
                onabort: () => {
                    dialog.value.show = false;
                }
            });
        };

        const deleteContacts = (): void => {
            dialog.value.show = true;
            Object.assign(dialog.value.settings, {
                title: text.deleteAllContacts,
                message: text.areYouSure,
                confirmationLabel: text.confirm,
                abortLabel: text.close,
                onaccept: () => {
                    contacts.deleteAll();
                    dialog.value.show = false;
                },
                onabort: () => {
                    dialog.value.show = false;
                }
            });
        };

        const restoreDefaultContacts = (): void => {
            dialog.value.show = true;
            Object.assign(dialog.value.settings, {
                title: text.restoreDefaultContacts,
                message: text.restoreDefaultContactsConfirm,
                confirmationLabel: text.confirm,
                abortLabel: text.close,
                onaccept: () => {
                    contacts.loadDemoContacts();
                    contacts.saveAll();
                    dialog.value.show = false;
                },
                onabort: () => {
                    dialog.value.show = false;
                }
            });
        };

        const deleteAllConfiguration = (): void => {
            dialog.value.show = true;
            Object.assign(dialog.value.settings, {
                title: text.deleteAll,
                message: text.areYouSure,
                confirmationLabel: text.confirm,
                abortLabel: text.close,
                onaccept: () => {
                    chat.deleteAllConversations();
                    contacts.deleteAll();
                    chat.saveHistory();
                    contacts.saveAll();
                    dialog.value.show = false;
                },
                onabort: () => {
                    dialog.value.show = false;
                }
            });
        };

        watchEffect(() => {
            setLang(defaultLang.value);

            const name = inputUserName.value.trim() || text.defaultUser;
            settings.userName.set(name);
            settings.language.set(defaultLang.value);

            settings.saveSettings();
            openai.saveConfiguration();
        });

        return {
            openai,
            inputUserName, allModels,
            deleteConversations, deleteContacts,
            restoreDefaultContacts, deleteAllConfiguration, defaultLang,
            dialog, languages, text, temperatures
        };
    }
});
</script>
