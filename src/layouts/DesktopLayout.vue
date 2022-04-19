<template>
    <div id="desktop-layout">
        <div class="flex flex-row">
            <div class="relative h-screen" style="width: 35%">
                <Contacts
                    ref="contactsView"
                    @selected="selected"
                    :emitSelected="true"
                />
            </div>
            <div
                class="relative w-1 h-20 bg-blue-400 resizeur"
                id="resizer"
            ></div>
            <div class="relative flex-1">
                <Chat
                    v-bind="{ backMode: false, contactId: selectedContact }"
                    :key="selectedContact"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { onMounted, ref, watchEffect } from "vue"

import Contacts from "../views/Contacts.vue"
import Chat from "../views/Chat.vue"
import { makeResizable } from "../utils/divHorizontalResize.js"

export default {
    name: "DesktopLayout",
    components: {
        Contacts,
        Chat,
    },
    // eslint-disable-next-line
    setup() {
        const selectedContact = ref(null)
        const contactsView = ref(null)
        const selected = (contactId: number): void => {
            selectedContact.value = contactId
            contactsView.value.selectedContact = contactId
        }
        onMounted(() => {
            makeResizable("resizer")
        })
        return {
            selected,
            contactsView,
            selectedContact,
        }
    },
}
</script>
<style scoped>
.resizeur {
    cursor: col-resize;
}
</style>
