<template>
    <div  id="desktop-layout">
        <div id="box" class="flex flex-row">
            <div class="relative h-screen" style="width: 30%">
                <Contacts
                    ref="contactsView"
                    @selected="selected"
                    :emitSelected="true"
                />
            </div>
            <div
                class="relative w-1 h-20 bg-cyan-600 resizeur"
                id="resizer"
            ></div>
            <div ref="box" class="relative flex-1">
                <Chat
                    v-bind="{ backMode: false, contactId: selectedContact }"
                    :key="selectedContact"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { nextTick, onBeforeMount, onMounted, ref, watchEffect } from "vue"

import Contacts from "../views/Contacts.vue"
import Chat from "../views/Chat.vue"
import { makeResizable } from "../utils/divHorizontalResize.js"

import { navigation } from "../services/navigation"

export default {
    name: "DesktopLayout",
    components: {
        Contacts,
        Chat,
    },
    // eslint-disable-next-line
    setup() {
        const selectedContact = navigation.activeContactId
        const contactsView = ref(null)
        const box = ref(null)
        const selected = (contactId: number): void => {
            navigation.setActiveContact(contactId)
        }
        onMounted(() => {
            makeResizable("resizer")
        })

        return {
            selected,
            contactsView,
            selectedContact,
            box
        }
    },
}
</script>
<style scoped>
.resizeur {
    cursor: col-resize;
}
</style>
