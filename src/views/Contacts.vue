<template>
<NavBar>
	<template #nav-bar-content>
		<!-- title -->
		<div id="nav-title" class="flex items-center text-2xl font-light">
			<div id="bran-logo" class="px-2 ml-2">
				<svg class="fill-current" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M10.865 17.097c-2.289.805-5.172-.535-5.755-2.756-2.878-.005-5.086-1.408-5.11-3.886-.038-4.031 4.516-9.448 12-9.455 7.485-.007 11.996 5.312 12 10.329.004 5.017-4.182 6.897-7.607 6.263-.364 1.507-.171 3.578.232 4.747l-2.109.661c-.813-2.788-2.2-4.967-3.651-5.903zm-.692-9.276c-.691-.314-1.173-1.012-1.173-1.821 0-1.104.896-2 2-2s2 .896 2 2c0 .26-.05.509-.14.738 1.214.911 2.405 1.855 3.599 2.794.425-.333.96-.532 1.541-.532 1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5c-1.171 0-2.155-.807-2.426-1.895-1.201.098-2.404.173-3.606.254-.169.933-.987 1.641-1.968 1.641-1.104 0-2-.896-2-2 0-1.033.785-1.884 1.79-1.989.121-.731.252-1.46.383-2.19zm2.06-.246c-.297.232-.661.383-1.058.417l-.363 2.18c.504.224.898.651 1.08 1.177l3.647-.289c.047-.267.137-.519.262-.749l-3.568-2.736z"/></svg>
			</div>
			Keep Talking
			<p style="padding-left:3px; margin-bottom: 8px; font-size:9px" >v0.2</p>
		</div>
		<div id="nav-menu-content" class="flex">
			<div class="flex justify-content-around">
				<div id="contact-add" class="pr-8 hover:animate-spin" @click="openAddContact()">
					<svg class="fill-current"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.5 15c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-7.18 4h-14.815l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 6.751 0 7.506 7.595 3.64 13.679-1.292 2.031-2.64 3.63-2.64 5.821 0 1.747.696 3.331 1.82 4.5z"/></svg>
				</div>
				<div id="settings-btn" @click="openSettings()">
					<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
				</div>
			</div>
		</div>
	</template>
</NavBar>

<!-- contact list -->
<div class="pt-20 h-screen bg-gradient-to-b overflow-y-auto from-gray-100 pb-10 ">
	<ul class="grid grid-cols-1 select-none">
		<!-- contact -->
		<div v-for='contact, id in contactList' :key='id'>
			<div id="contact" class="active:bg-gray-900" @click="openChat(contact.id)">
				<div id="contact-image">
					<img :src="contact.img" alt="user image" />
				</div>
				<p>
					{{ contact.name }}
				</p>
			</div>
		</div>
	</ul>
</div>

</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { allContacts } from '@/chat.ts'

import NavBar from '@/components/NavBar.vue'

export default {
	name:"Contacts",
	components:{
		NavBar
	},
	// eslint-disable-next-line
	setup(){
		const router = useRouter()
		const contactList = allContacts 
		const openChat = (contactId : number) : void => {
			router.push('/chat/' + contactId)
		}

		const openSettings = () : void => {
			router.push('/settings')
		}

		const openAddContact = () : void => {
			router.push('/newcontact')
		}

		return {
			openChat,
			openSettings,
			openAddContact,
			contactList
		}	
	}
}	
</script>
<style scoped>
#contact {
	@apply flex h-24 p-4 font-light text-2xl border-2 transition duration-500;
	@apply  hover:bg-gray-200;
}

#contact-image {
	@apply w-16 h-16;
}

#contact-image > img {
	@apply rounded-full border border-gray-100 shadow-sm;
	@apply object-cover h-16;
}

#contact > p {
	@apply pt-3 pl-3;
}

#settings-btn:hover {
	@apply animate-spin;
}
</style>