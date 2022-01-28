<template>
<div 
    id="contacts-view"
    class="flex flex-col h-screen">
    <NavBar :fixed='false'>
        <!-- title -->
        <template #navbar-title>
            <div id="nav-title" class="font-light mt-7 ml-2">
                <div class="flex">
                    <Logo/>
                    <!--<p style="padding-left:1px; margin-bottom: 8px; font-size:9px" >v0.4</p>-->
                </div>
            </div>
        </template>
        <template #navbar-content>
            <div id='options' class="flex md:gap-4 mt-5  mr-1 md:mr-3">
                <div id="contact-add" class="menu-btn" @click="openAddContact()">
                    <svg class="fill-current"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.5 15c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-7.18 4h-14.815l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 6.751 0 7.506 7.595 3.64 13.679-1.292 2.031-2.64 3.63-2.64 5.821 0 1.747.696 3.331 1.82 4.5z"/></svg>
                </div>
                <div id="settings-btn" class="menu-btn" @click="openSettings()">
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                </div>
                <div id="help-btn" class="menu-btn" @click="openHelp()">
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.601 21.5c0 1.38-1.116 2.5-2.499 2.5-1.378 0-2.499-1.12-2.499-2.5s1.121-2.5 2.499-2.5c1.383 0 2.499 1.119 2.499 2.5zm-2.42-21.5c-4.029 0-7.06 2.693-7.06 8h3.955c0-2.304.906-4.189 3.024-4.189 1.247 0 2.57.828 2.684 2.411.123 1.666-.767 2.511-1.892 3.582-2.924 2.78-2.816 4.049-2.816 7.196h3.943c0-1.452-.157-2.508 1.838-4.659 1.331-1.436 2.986-3.222 3.021-5.943.047-3.963-2.751-6.398-6.697-6.398z"/></svg>
                </div>
            </div>
        </template>
    </NavBar>
    <!-- contact list -->
    <div class="h-screen bg-gradient-to-b overflow-y-scroll from-gray-100">
        <ul class="grid grid-cols-1 select-none">
            <!-- contact -->
            <div v-for='contact, id in contact.list' :key='id'>
                <div class="contact" :class="{ 'contact-selected': selectedContact==contact.id }" @click="openChat(contact.id)">
                        <div id="contact-image">
                            <img v-bind="{ 'src': contact.img, 'alt': contact.name }"/>
                        </div>
                    <p id="contact-name">{{ contact.name }}</p>
                </div>
            </div>
        </ul>
    </div>
</div>
</template>
<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { contacts } from '../chat'

import NavBar from '../components/NavBar.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import Logo from '../components/Logo.vue'

export default {
    name:"Contacts",
    components:{
        Logo,
        NavBar,
    },
    props:{
        emitSelected: {
            type:Boolean,
            default:false
        }
    },
    emits:['selected'],
    // eslint-disable-next-line
    setup(props, context){
        const router = useRouter()
        const contact = ref(contacts)
        const selectedContact = ref(null)

        const openChat = (contactId : number) : void => {
            if(props.emitSelected)
                context.emit('selected', contactId)
            else
                router.push('/chat/' + contactId)
        }

        const openSettings = () : void => {
            router.push('/settings')
        }

        const openAddContact = () : void => {
            router.push('/newcontact')
        }

        const openHelp = () : void => {
            router.push('/help')
        }

        return {
            openChat,
            openSettings,
            openAddContact,
            openHelp,
            contact,
            selectedContact
        }   
    }
}   
</script>
<style scoped>
.contact {
    @apply flex h-24 p-4 font-light text-2xl border-2 transition duration-500;
    @apply  hover:bg-gray-200;
}

.contact-selected {
    @apply bg-gray-300 hover:bg-gray-400;
}

#contact-image {
    @apply block w-16 h-16;
}

#contact-image > img {
    @apply rounded-full border border-gray-100 shadow-sm;
    @apply object-cover h-16;
}

.contact > p {
    @apply pt-3 pl-3;
}

.menu-btn {
    @apply p-2 pt-3 md:p-3 rounded transition duration-100 active:bg-blue-400 hover:bg-blue-600 pb-2;
}
</style>