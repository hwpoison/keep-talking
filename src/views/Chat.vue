<template>
  <div
    ref="chatView"
    id="chat-view"
    class="absolute flex flex-col inset-0"
    tabindex="0"
    @keyup.alt.r="retryLast()"
    @keyup.ctrl.z="undoMessage()"
    @keyup.alt.k="keepTalk()"
    @keyup.alt.l="cleanChat()"
  >
    <NavBar :showBackButton="backMode">
      <template #navbar-title>
        <!-- Contact Information -->
        <div v-show="contactId != null" class="flex ml-2 mt-3">
          <div class="flex-none" id="contact-photo">
            <img :src="contactInfo.img" class="object-cover" alt="user image" />
          </div>
          <div class="text-left">
            <p id="contact-name" class="inline-block text-center px-3 text-2xl">
              {{ contactInfo.name }}
            </p>
            <p class="text-light text-md italic sm:pl-3 pl-3">
              {{ chatStatus }}
            </p>
          </div>
        </div>
      </template>
      <template #navbar-content>
        <!-- Chat Options Btn and Menu -->
        <div
          v-show="contactId != null"
          class="flex justify-end mt-4"
          style="width: 160px"
        >
          <button
            @click="showOptionsMenu = !showOptionsMenu"
            id="dropdownSmallButton"
            data-dropdown-toggle="dropdownSmall"
            class="mr-1 mb-1 md:mb-0 text-white focus:ring-4 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
            type="button"
          >
            <svg
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"
              />
            </svg>
          </button>
        </div>
        <div class="absolute dropdown-wrapper">
          <transition name="slide-fade">
            <div class="flex" v-show="showOptionsMenu">
              <ToClickOutside @click="hideMenu()" />
              <div
                class="z-20 bg-blue-500 border-2 border-blue-600 dropdown-menu text-white rounded shadow-lg w-40 max-w-xs"
              >
                <ul class="list-none overflow-hidden rounded">
                  <a
                    @click="undoMessage()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-blue-400"
                    ><UndoButton
                  /></a>
                  <a
                    @click="retryLast()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-blue-400"
                    ><RetryButton
                  /></a>
                  <a
                    @click="keepTalk()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-blue-400"
                    ><KeepTalkButton
                  /></a>
                  <a
                    @click="cleanChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-blue-400"
                    ><CleanButton
                  /></a>
                </ul>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </NavBar>
    <template v-if="contactId === null">
      <div class="chat justify-evenly">
        <p class="pt-48 text-3xl font-thin font-extralight select-none">
          👈 Selecciona a alguien y comienza a conversar.
        </p>
      </div>
    </template>
    <!-- Chat content -->
    <div
      class="flex-1 bg-gray-200 bg-gradient-to-b overflow-y-scroll from-gray-100"
      ref="chat"
      v-show="contactId != null"
    >
      <div class="chat-message">
        <div class="chat-message-content font-sans p-3">
          <ul class="grid grid-cols-1">
            <transition-group name="list" tag="p">
              <div
                v-for="(message, idx) in messages"
                class="flex flex-col"
                :key="idx"
              >
                <div
                  class="place-self-start text-left cursor-default py-2"
                  :class="
                    message.from == contactInfo.name
                      ? 'pr-20'
                      : 'place-self-end pl-20'
                  "
                >
                  <div
                    class="bg-white p-3 word-break rounded-r-lg rounded-1 shadow"
                    :class="{
                      'bg-green-100 rounded-l-lg':
                        message.from != contactInfo.name,
                    }"
                  >
                    {{ message.message }}
                  </div>
                </div>
              </div>
            </transition-group>
          </ul>
        </div>
        <!-- TODO: ADD TO BOTTOM BUTTON ARROW -->
      </div>
    </div>

    <!-- Message input box -->
    <form
      id="input-form"
      class="flex justify-between bottom-0"
      @submit.prevent="send()"
      v-show="contactId != null"
    >
      <input
        ref="userInput"
        v-model="inputUserMessage"
        class="relative grow transition duration-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent py-1 pb-2 px-4 rounded-none"
        placeholder="Escribir algo..."
        required
      />
      <button class="flex-none" id="input-btn">Enviar</button>
    </form>
  </div>
</template>
<script>
import { nextTick, reactive, ref, onBeforeUpdate, onMounted } from "vue"
import { useRoute } from "vue-router"
import { openai } from "../openai/openai.js"

import {
  getUserInfo,
  deleteLastMessage,
  getContactInfo,
  getOrCreateChat,
  addMessage,
  clearChat,
} from "../chat.ts"

import NavBar from "../components/NavBar.vue"
import Logo from "../components/Logo.vue"
import ToClickOutside from "../components/ToClickOutside.vue"
import UndoButton from "../components/Buttons/UndoButton.vue"
import CleanButton from "../components/Buttons/CleanButton.vue"
import RetryButton from "../components/Buttons/RetryButton.vue"
import KeepTalkButton from "../components/Buttons/KeepTalkButton.vue"

import { deviceType } from "../utils/detectDevice.js"

/* eslint-disable */
export default {
  name: "Chat",
  components: {
    Logo,
    NavBar,
    ToClickOutside,
    UndoButton,
    CleanButton,
    RetryButton,
    KeepTalkButton,
  },
  props: {
    contactId: {
      type: Number,
      default: null,
    },
    backMode: {
      type: Boolean,
      default: true,
    },
  },
  // eslint-disable-next-line
  setup(props) {
    const route = useRoute()

    // refs
    const chatView = ref(null)
    const chat = ref(null) // chat box reference
    const userInput = ref(null) // input box reference

    const chatStatus = ref("Online")
    const showOptionsMenu = ref(false)

    const contactID = ref(null)
    const messages = ref(null)
    const userInfo = reactive({})
    const contactInfo = reactive({ img: "", name: "" })
    const inputUserMessage = ref(null)

    const isChatEmpty = () => {
      return messages.value.length === 0
    }

    const cleanChat = () => {
      clearChat(contactID.value)
      showOptionsMenu.value = false
    }

    // Retry last message
    const retryLast = () => {
      if (isChatEmpty()) {
        hideMenu()
        return
      }
      deleteLastMessage(contactID.value)
      send(true)
      hideMenu()
    }

    // Continue generating conversation
    const keepTalk = () => {
      if (isChatEmpty()) {
        hideMenu()
        return
      }
      send(true)
      hideMenu()
    }

    // focus the input message box
    const focusInput = () => {
      userInput.value.focus()
    }

    // delete the last message
    const undoMessage = () => {
      if (isChatEmpty()) {
        hideMenu()
        return
      }
      deleteLastMessage(contactID.value)
      hideMenu()
    }

    const hideMenu = () => {
      showOptionsMenu.value = false
    }

    const getNLActualDate = () => {
      // natural language full date
      const date = new Date()
      let fulldate = date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      let time = date.toTimeString()

      return `Hoy es ${fulldate} y son las ${time}\n`
    }

    const send = async (trying = false) => {
      let newquery = ""
      // 1) prepare and generate query

      newquery += getNLActualDate()
      newquery +=
        contactInfo.name + ":" + JSON.stringify(contactInfo.personality) + "\n"
      newquery += contactInfo.context + "\n"

      if (!trying) {
        let prompt = inputUserMessage.value
        // add user message to chatbox
        addMessage(contactID.value, userInfo.name, prompt, true)
        scrollChatToBottom()
        inputUserMessage.value = ""
      }
      /*
          Inject chat style text
            <...conversation context...>
            User: Hi how are u
            Bot:    <---- this will be autocompleted
      */

      // take all previous chat
      messages.value
        .map((msg) => {
          return msg.from + ":" + msg.message
        })
        .forEach((x) => (newquery += x + "\n"))

      // inject bot name
      newquery += contactInfo.name + ":"

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
        addMessage(contactID.value, contactInfo.name, generatedResponse)
        scrollChatToBottom()
        chatStatus.value = "Online"
      } catch (error) {
        if (error.response.status == 401) {
          // unauthorized
          //.. handle notification
          console.error("[x]Problem with api key")
          scrollChatToBottom()
        }
        addMessage(
          contactID.value,
          contactInfo.name,
          "Lo siento, no puedo responderte en este momento."
        )
        scrollChatToBottom()
        chatStatus.value = "Offline (General Error)"
        console.error("[x] General error")
      }
    }

    const scrollChatToBottom = async () => {
      await nextTick()
      chat.value.scrollTop = chat.value.scrollHeight
    }

    const resetUI = () => {
      hideMenu()
      scrollChatToBottom()
    }

    const loadData = () => {
      focusInput()
      contactID.value = props.contactId
      messages.value = getOrCreateChat(contactID.value)
      Object.assign(contactInfo, getContactInfo(contactID.value))
      Object.assign(userInfo, getUserInfo())
      resetUI()
    }

    onBeforeUpdate(() => {
      loadData()
    })

    onMounted(() => {
      loadData()
    })

    return {
      chat,
      userInput,
      contactInfo,
      messages,
      cleanChat,
      showOptionsMenu,
      hideMenu,
      userInfo,
      retryLast,
      undoMessage,
      chatStatus,
      inputUserMessage,
      send,
      chatView,
      keepTalk,
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

.list-enter-active {
  transition: all 0.3s;
}
.list-leave-active {
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>
