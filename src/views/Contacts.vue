<template>
    <div id="contacts-view" class="absolute inset-0 flex flex-col">
        <NavBar>
            <!-- title -->
            <template #navbar-title>
                <div id="nav-title" class="font-light mt-7 ml-2">
                    <div class="flex">
                        <Logo />
                        <!--<p style="padding-left:1px; margin-bottom: 8px; font-size:9px" >v0.4</p>-->
                    </div>
                </div>
            </template>
            <template #navbar-content>
                <div id="options" class="flex md:gap-4 mt-5 mr-1 md:mr-3">
                    <div id="contact-add" class="menu-btn" @click="openAddContact()">
                        <AddContactButton />
                    </div>
                    <div id="settings-btn" class="menu-btn" @click="openSettings()">
                        <SettingsButton />
                    </div>
                    <div id="help-btn" class="menu-btn" @click="openHelp()">
                        <HelpButton />
                    </div>
                </div>
            </template>
        </NavBar>
        <!-- contact list -->
        <div class="flex-1 bg-gradient-to-b overflow-y-scroll from-gray-100 pb-14 md:pb-0">
            <ul class="grid grid-cols-1 select-none">
                <!-- contact -->
                <div v-for="[id, contact_item] in contact.getAll()" :key="id">
                    <div class="contact overflow-hidden items-center" :class="{
                        'contact-selected': selectedContact == id,
                    }" @click="openChat(Number(id))">
                        <div id="contact-image">
                            <img v-bind="{ src: contact_item.img, alt: contact_item.name }" />
                        </div>
                        <p id="contact-name" class="overflow-hidden mb-1 w-full text-left">
                            {{ contact_item.name }}<br /><span
                                class="italic font-normal text-gray-400 text-lg truncateline">{{
                                    chat.getLastMessage(id) }}
                            </span>
                        </p>
                    </div>
                </div>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import chat from "../services/chat"
import contacts from "../services/contacts"
import { navigation } from "../services/navigation"

import NavBar from "../components/NavBar.vue"
import Logo from "../components/Logo.vue"

import SettingsButton from "../components/Buttons/SettingsButton.vue"
import HelpButton from "../components/Buttons/HelpButton.vue"
import AddContactButton from "../components/Buttons/AddContactButton.vue"

export default {
    name: "Contacts",
    components: {
        Logo,
        NavBar,
        SettingsButton,
        HelpButton,
        AddContactButton,
    },
    props: {
        emitSelected: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["selected"],
    // eslint-disable-next-line
    setup(props, context) {
        const router = useRouter()
        const contact = ref(contacts)
        const selectedContact = navigation.activeContactId

        const openChat = (contactId: number): void => {
            navigation.setActiveContact(contactId);
            if (props.emitSelected) context.emit("selected", contactId)
            else router.push("/chat/" + contactId)
        }
        const openSettings = (): void => {
            router.push("/settings")
        }

        const openAddContact = (): void => {
            router.push("/newcontact")
        }

        const openHelp = (): void => {
            router.push("/help")
        }

        return {
            openChat,
            openSettings,
            openAddContact,
            openHelp,
            contact,
            selectedContact,
            chat
        }
    },
}
</script>
<style scoped>
.contact {
    @apply flex h-24 p-4 font-light font-sans md:font-normal text-2xl transition duration-500;
    @apply hover:bg-gray-200;
}

.contact-selected {
    @apply bg-gray-200 hover:bg-gray-200;
}

#contact-image>img {
    @apply rounded-full border border-gray-200 shadow-md;
    @apply object-cover w-20 h-16 md:w-24 md:h-20;
}

.contact>p {
    @apply pt-3 pl-3;
}

.truncateline {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.menu-btn {
    @apply p-2 pt-3 md:p-3 rounded transition duration-100 active:bg-cyan-400 hover:bg-cyan-600 pb-2;
}
</style>
