<template>
<div>
  <NavBar :showBackButton="true">
    <template #navbar-title>
      <!-- contact photo -->
      <div class="flex ml-2 mt-3">
          <div class="flex-none" id="contact-photo">
            <img
              :src="contactInfo.image"
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
        <button @click="show = !show" :class="'bg-blue-400'" class="text-white font-bold py-2 px-10 whitespace-no-wrap rounded transition duration-300"> Opciones <i class="fas fa-chevron-down ml-2"></i></button>
        <div class="dropdown-wrapper mr-10 ">
          <transition name="slide-fade">
            <div :class="'bg-blue-400'" class="absolute dropdown-menu text-white rounded z-10 shadow-lg w-40 max-w-xs mr-20" v-show="show">
              <ul class="list-none overflow-hidden rounded">
                <a href="" class="flex py-2 px-4 transition duration-300 hover:bg-blue-200" :class="'theme-blue'">Reintentar ultimo mensaje</a>
                <a href="" class="flex py-2 px-4 transition duration-300 hover:bg-blue-200" :class="'theme-blue'">Limpiar Chat</a>
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
            v-for="(message, id) in messages"
            class="flex flex-col"
            :key="id"
          >
            <div
              class="place-self-start text-left cursor-default"
              :class="message.from == 'own' ? 'place-self-end pl-20 ' : 'pr-20'"
            >
              <div
                class="bg-white p-3 word-break rounded-r-lg rounded-1 shadow"
                :class="{ 'rounded-l-lg bg-green-100': message.from == 'own' }"
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
      @submit.prevent="send"
    >
      <input
        ref="input"
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

import {initNewChat, messagesCollection, sendMessage, allContacts} from "@/chat.ts"

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

    const show = ref(false)

    const chat = ref(null) // chat box reference
    const input = ref(null) // input box reference

    const inputUserMessage = ref(null)
    const chatTokenHistory = ref("")

    const chatStatus = ref("Online")

    const messages = ref(null)

    const contactInfo = reactive({
      name: null,
      image: null,
      personality: null,
      preferedEngine: null,
      preferedTemperature: null,
    })

    const scrollChatToBottom = () => {
      chat.value.scrollTop = chat.value.scrollHeight
    }

    const send = async () => {
      let prompt = inputUserMessage.value
      // add user message to chatbox
      sendMessage(route.params.id, "own", prompt)
      inputUserMessage.value = ""
      scrollChatToBottom()

      // 1) prepare and generate response

      /*
          Inject chat style text
          "
            <...conversation context...>
            User: Hi how are u
            Bot:    <---- this will be autocompleted
          "

      */
      chatTokenHistory.value +=
        "\nUsuario:" + prompt + "\n" + contactInfo.name + ":"// inject start text

      // 2) send request
      chatStatus.value = "Escribiendo..."
      try {
        const response = await openai.chatGen(
        chatTokenHistory.value,
        contactInfo.name,
        contactInfo.preferedEngine,
        contactInfo.preferedTemperature
        )
        const generated = response.data.choices[0].text
        // 3) update history
        chatTokenHistory.value += generated
        sendMessage(route.params.id, "bot", generated)
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

    // Load functions
    const getContactInfo = (contactId) => {
      // console.log("[+] Loading person info ", contactId)
      let info = allContacts.find((obj) => obj.id == contactId)
      contactInfo.name = info.name
      contactInfo.image = info.img
      contactInfo.personality = JSON.stringify(info.personality)

      // alternative option values
      if (info.preferedEngine) contactInfo.preferedEngine = info.preferedEngine
      if (info.preferedTemperature)
        contactInfo.preferedTemperature = info.preferedTemperature

      // craft init conversation context with contact info
      chatTokenHistory.value =
        contactInfo.name + ":" + contactInfo.personality + "\n" + info.context + '\n' 
    }

    const loadOrInitChat = (contactId) => {
      const chatRecord = messagesCollection[contactId]
      messages.value = chatRecord ? chatRecord : initNewChat(contactId)
    }

    onMounted(() => {
      getContactInfo(route.params.id)
      loadOrInitChat(route.params.id)
      input.value.focus()
    })

    onUpdated(() => {
      scrollChatToBottom()
    })

    return {
      chat,
      input,
      contactInfo,
      messages,

      show,

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
