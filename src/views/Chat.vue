<template>
<div 
  @keyup.shift.r="retryLast()" 
  @keyup.shift.u="undoMessage()"
  tabindex="0">
  <NavBar :showBackButton="true">
    <template #navbar-title>
      <!-- contact photo -->
      <div class="flex ml-2 mt-3">
          <div class="flex-none" id="contact-photo">
            <img
              :src="contactInfo.img"
              class="object-cover"
              alt="user image"
            />
          </div>
          <div class="text-left">
            <p id="contact-name" class="inline-block text-center px-3 text-2xl">
              {{ contactInfo.name }}
            </p>
            <p class="text-light text-md italic sm:pl-3 pl-3">{{ chatStatus }}</p>
          </div>
      </div>
    </template>
    <template #navbar-content>
      <div class="flex justify-end mt-4" style="width: 160px" >
        <button @click="showMenu = !showMenu" id="dropdownSmallButton" data-dropdown-toggle="dropdownSmall" class="mr-1 mb-1 md:mb-0 text-white focus:ring-4 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center" type="button"><svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/></svg></button>
      </div>
        <div class="absolute dropdown-wrapper">
          <transition name="slide-fade">
            <div :class="'bg-blue-400'" class=" dropdown-menu text-white rounded z-10 shadow-lg w-40 max-w-xs " v-show="showMenu">
              <ul class="list-none overflow-hidden rounded">
                
                <a @click="undoMessage()" class="flex py-2 px-3 transition duration-300 hover:bg-blue-200" :class="'theme-blue'"><li class="pr-2"><svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M12 0c-3.31 0-6.291 1.353-8.459 3.522l-2.48-2.48-1.061 7.341 7.437-.966-2.489-2.488c1.808-1.808 4.299-2.929 7.052-2.929 5.514 0 10 4.486 10 10s-4.486 10-10 10c-3.872 0-7.229-2.216-8.89-5.443l-1.717 1.046c2.012 3.803 6.005 6.397 10.607 6.397 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/></svg></li>Deshacer<span style="font-size:12px" class="invisible md:visible">(S+U)</span></a>

                <a @click="retryLast()" class="flex py-2 px-3 transition duration-300 hover:bg-blue-200" :class="'theme-blue'"><li class="pr-1"><svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.728 20.644l1.24 1.588c-1.721 1.114-3.766 1.768-5.969 1.768-4.077 0-7.626-2.225-9.524-5.52l-1.693.982 1.09-4.1 4.101 1.089-1.747 1.014c1.553 2.699 4.442 4.535 7.773 4.535 1.736 0 3.353-.502 4.729-1.356zm-13.722-7.52l-.007-.124c0-4.625 3.51-8.433 8.003-8.932l-.002 1.932 3.004-2.996-2.994-3.004-.004 2.05c-5.61.503-10.007 5.21-10.007 10.95l.021.402 1.986-.278zm18.577 5.243c.896-1.588 1.416-3.414 1.416-5.367 0-4.577-2.797-8.499-6.773-10.156l-.623 1.914c3.173 1.393 5.396 4.561 5.396 8.242 0 1.603-.441 3.097-1.18 4.402l-1.762-.964 1.193 4.072 4.071-1.192-1.738-.951z"/></svg></li>Reintentar<span style="font-size:12px" class="invisible md:visible">(S+R)</span></a>
                
                <a @click="cleanChat()" class="flex py-2 px-2 transition duration-300 hover:bg-blue-200" :class="'theme-blue'"><li class="pr-2" title="asasd"><svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.58 0c-1.234 0-2.377.616-3.056 1.649-.897 1.37-.854 3.261-1.368 4.444-.741 1.708-3.873.343-5.532-.524-2.909 5.647-5.025 8.211-6.845 10.448 6.579 4.318 1.823 1.193 12.19 7.983 2.075-3.991 4.334-7.367 6.825-10.46-1.539-1.241-4.019-3.546-2.614-4.945 1-1 2.545-1.578 3.442-2.95 1.589-2.426-.174-5.645-3.042-5.645zm-5.348 21.138l-1.201-.763c0-.656.157-1.298.422-1.874-.609.202-1.074.482-1.618 1.043l-3.355-2.231c.531-.703.934-1.55.859-2.688-.482.824-1.521 1.621-2.331 1.745l-1.302-.815c1.136-1.467 2.241-3.086 3.257-4.728l8.299 5.462c-1.099 1.614-2.197 3.363-3.03 4.849zm6.724-16.584c-.457.7-2.445 1.894-3.184 2.632-.681.68-1.014 1.561-.961 2.548.071 1.354.852 2.781 2.218 4.085-.201.265-.408.543-.618.833l-8.428-5.548.504-.883c1.065.445 2.1.678 3.032.678 1.646 0 2.908-.733 3.464-2.012.459-1.058.751-3.448 1.206-4.145 1.206-1.833 3.964-.017 2.767 1.812zm-.644-.424c-.265.41-.813.523-1.22.257-.409-.267-.522-.814-.255-1.223.267-.409.813-.524 1.222-.257.408.266.521.817.253 1.223z"/></svg></li>Eliminar Chat</a>
              </ul>
            </div>
          </transition>
        </div>
  </template>
  </NavBar>
  <!-- Chat content -->
  <div
    ref="chat"
    class="pt-20 h-screen bg-gray-200 bg-gradient-to-b overflow-y-auto from-gray-100 pb-16"
  >
    <div class="chat-message">
      <div class="chat-message-content p-3 lg:text-2xl">
        <ul class="space-y-4 grid grid-cols-1">
          <div
            v-for="(message, idx) in messages"
            class="flex flex-col"
            :key="idx"
          >
            <div
              class="place-self-start cursor-default"
              :class="message.from == contactInfo.name ? 'text-left pr-20' : 'place-self-end  pl-20'"
            >
              <div
                class="bg-white p-3 word-break rounded-r-lg rounded-1 shadow"
                :class="{ 'bg-green-100 rounded-l-lg': message.from != contactInfo.name }"
              >
                {{ message.message }}
              </div>
            </div>
          </div>
        </ul>
      </div>
      <!-- TODO: ADD TO BOTTOM BUTTON ARROW -->
    </div>
  </div>
  <!-- Message input box -->
  <div clss="flex justify-center">
    <form
      class="fixed w-full flex justify-between bottom-0"
      @submit.prevent="send()">
      <input
        ref="userInput"
        v-model="inputUserMessage"
        class="flex-grow transition duration-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent py-1 pb-2 px-4 rounded-none"
        placeholder="Message"
        required
      />
      <button id="input-btn">Enviar</button>
    </form>
  </div>
</div>
</template>
<script>
import { reactive, ref, onUpdated, onMounted } from "vue"
import { useRoute } from "vue-router"
import { openai } from "@/openai"

import { getUserInfo, deleteLastMessage, getContactInfo, getOrCreateChat, addMessage, clearChat } from "@/chat.ts"

import NavBar from "@/components/NavBar"

/* eslint-disable */
export default {
  name: "Chat",
  components: {
    NavBar,
  },
  // eslint-disable-next-line
  setup() {
    const route = useRoute()

    
    // refs
    const chat = ref(null) // chat box reference
    const userInput = ref(null) // input box reference

    const inputUserMessage = ref(null)


    const chatStatus = ref("Online")
    const showMenu = ref(false)

    const contactID = route.params.id
    const messages = ref(getOrCreateChat(contactID))

    const userInfo = reactive(getUserInfo())
    const contactInfo = reactive(getContactInfo(contactID))
    
    const contextToken = ref(contactInfo.name + ":" + JSON.stringify(contactInfo.personality) + "\n" + contactInfo.context + '\n')

    const scrollChatToBottom = () => {
      chat.value.scrollTop = chat.value.scrollHeight
    }

    const retryLast = ()=>{
      deleteLastMessage(contactID)
      send(true)
      showMenu.value = false
    }

    const undoMessage = () => {
      deleteLastMessage(contactID)
    }

    const getActualDate = ()=>{
      const date = new Date()
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options) // in natural language
    }

    const send = async (trying=false) => {
      // 1) prepare and generate response
      let newquery = ''
      newquery+= 'Hoy es ' + getActualDate() + '\n'
      newquery+=contextToken.value

      if(!trying){
        let prompt = inputUserMessage.value
        // add user message to chatbox
        addMessage(route.params.id, userInfo.name, prompt)
        inputUserMessage.value = ""
        scrollChatToBottom()
      }
      /*
          Inject chat style text
            <...conversation context...>
            User: Hi how are u
            Bot:    <---- this will be autocompleted
      */

      // take all previous chat
      messages.value.map(msg=>{return msg.from+":"+msg.message}).forEach(x=>newquery+=x+"\n")
      // inject bot name
      newquery+=contactInfo.name + ':'
      // 2) send request
      chatStatus.value = "Escribiendo..."
      try {
        const response = await openai.chatGen(
          newquery,
          userInfo.name,
          contactInfo.name,
          contactInfo.preferedEngine,
          contactInfo.preferedTemperature
        )
        const generatedResponse = response.data.choices[0].text
        addMessage(route.params.id, contactInfo.name, generatedResponse)
        chatStatus.value = "Online"
      } catch (error) {
        if(error.response.status == 401){ // unauthorized
          //.. handle notification
          console.log("[x]Problem with api key")
        }
        chatStatus.value = "Offline (General Error)"
      }
      scrollChatToBottom()
    }

    const cleanChat = () => {
      clearChat(contactID)
      showMenu.value = false
    }

    onMounted(() => {
      getContactInfo(contactID)
      scrollChatToBottom()
      userInput.value.focus()
    })

    onUpdated(() => {
      scrollChatToBottom()
    })

    return {
      chat,
      userInput,
      contactInfo,
      messages,
      cleanChat,
      showMenu,
      userInfo,
      retryLast,
      undoMessage,
      chatStatus,
      inputUserMessage,

      send,
    }
  },
}
</script>
<style scoped>
#contact-photo > img {
  @apply w-14 h-14;
  @apply rounded-full border border-gray-400 shadow-sm;
}

#input-btn {
  @apply text-white font-bold py-2 px-4;
  @apply transition duration-500;
  @apply bg-blue-500 hover:bg-blue-400;
  @apply active:bg-blue-500;
  @apply border-b-4 border-blue-700 hover:border-blue-500 rounded;
}

button{
  cursor:pointer;
  &:focus{
    outline:none;
  }
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

</style>
