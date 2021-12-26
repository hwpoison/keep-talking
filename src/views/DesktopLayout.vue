<template>
    <div id="desktop-layout">
        <div class="flex flex-grow">
            <div class="flex-none" style="width: 420px">
                <Contacts ref="contactsView" @selected="selected" :emitSelected=true />
            </div>
            <div class="shrink w-screen">
                <Chat v-bind="{ 'backMode':false, 'contactId':selectedContact }" :key="selectedContact" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { onMounted, ref, watchEffect } from "vue"

import Contacts from "../views/Contacts.vue"
import Chat from "../views/Chat.vue"

export default {
    name: "DesktopLayout",
    components: {
        Contacts,
        Chat
    },
    // eslint-disable-next-line
    setup() {
        const selectedContact = ref(null)
        const contactsView = ref(null)
        const selected = (contactId : number) : void => {
            selectedContact.value = contactId
            console.log(contactsView.value, contactsView.selectedContact, contactId)
            contactsView.value.selectedContact = contactId
        }
        return {
            selected,
            contactsView,
            selectedContact
        }
    },
}
</script>