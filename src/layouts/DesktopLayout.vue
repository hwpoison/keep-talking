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
        const box = ref(null)
        const selected = (contactId: number): void => {
            selectedContact.value = contactId
            contactsView.value.selectedContact = contactId
        }
        onMounted(() => {
            makeResizable("resizer")
            window.addEventListener("resize", ()=>{
            let iWidth = window.innerWidth
            if(iWidth < 800){
                location.reload()
                }
            })
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
