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
                class="z-20 bg-cyan-600 border-2 border-cyan-700 dropdown-menu text-white rounded shadow-lg w-40 max-w-xs"
              >
                <ul class="list-none overflow-hidden rounded">
                  <a
                    @click="undoMessage()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400"
                    ><UndoButton
                  > {{ text.undo }} </UndoButton></a>
                  <a
                    @click="retryLast()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400"
                    ><RetryButton
                    > {{ text.retry }} </RetryButton> </a>
                  <a
                    @click="keepTalk()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400"
                    ><KeepTalkButton
                  > {{ text.keepTalk }} </KeepTalkButton></a>
                  <a
                    @click="cleanChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400"
                    ><CleanButton
                  > {{ text.emptyChat }} </CleanButton></a>
                  <a
                    @click="exportChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400"
                    ><SaveButton
                  > {{ text.saveToFile }} </SaveButton></a>
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
          👈 {{ text.startToChat }}
        </p>
      </div>
    </template>
    <!-- Chat content -->
    <div
      class="flex-1 bg-gray-200 bg-gradient-to-b overflow-y-scroll from-gray-100"
      ref="chatBox"
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
                <!-- Message popup -->
                <div
                  class="place-self-start text-left cursor-default py-2"
                  :class="{
                      'pr-20':message.from == contactInfo.name, 
                      'place-self-end pl-20':message.from != contactInfo.name,
                  }"
                >
                  <!-- Message content -->
                  <div
                    class="bg-white p-3 word-break rounded-r-lg rounded-1 shadow"
                    :class="{
                      'bg-green-100 rounded-l-lg':message.from != contactInfo.name,
                      'bg-cyan-600 rounded-lg text-white':message.type == 'action'
                    }"
                  >
                    {{ message.message }}
                  </div>
                </div>
                <!-- End of Message popup -->
              </div>
            </transition-group>
          </ul>
        </div>
        <!-- TODO: ADD TO BOTTOM BUTTON ARROW -->
      </div>
    </div>

    <!-- Message input box -->
      <div v-show='maxMessagesAdvertence'> <span class="font-light" > {{ text.reachedLimit }} </span></div>
    <form
      id="input-form"
      class="flex justify-between bottom-0"
      @submit.prevent="sendMessage()"
      v-show="contactId != null"
    >
      <input
        ref="userInput"
        v-model="inputUserMessage"
        class="relative grow transition duration-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent py-1 pb-2 px-4 rounded-none"
        placeholder="Escribir algo..."
        required
      />
      <button class="flex-none" id="input-btn"> {{ text.send }} </button>
    </form>
  </div>
</template>
<script>

import exportFile from 'fs-browsers/dist/cjs/export-to-file/exportToFile';

import { nextTick, reactive, ref, onBeforeUpdate, onMounted } from "vue"
import { useRoute } from "vue-router"
import { openai } from "../openai/openai.js"
import settings from '../services/settings'
import contacts from "../services/contacts"
import chat from "../services/chat.ts"
import { text, getLang } from "../services/language";
import { getNLActualDate } from "../utils/date.ts"

import Logo from "../components/Logo.vue"
import NavBar from "../components/NavBar.vue"
import SaveButton from "../components/Buttons/SaveButton.vue"
import ToClickOutside from "../components/ToClickOutside.vue"
import UndoButton from "../components/Buttons/UndoButton.vue"
import CleanButton from "../components/Buttons/CleanButton.vue"
import RetryButton from "../components/Buttons/RetryButton.vue"
import KeepTalkButton from "../components/Buttons/KeepTalkButton.vue"


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
    SaveButton
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
    const chatView = ref(null) // entire view
    const chatBox = ref(null) // chat box reference
    const userInput = ref(null) // input box reference
    const chatStatus = ref(text.online)
    const showOptionsMenu = ref(false)

    const contactID = ref(null)
    const messages = ref(null)
    const userInfo = reactive({})
    const contactInfo = reactive({ img: "", name: "" })
    const inputUserMessage = ref(null)
    const maxMessagesAdvertence = ref(null)
    const maxMessages = settings.values['maxMessages']

    const isTheChatEmpty = () => {
      return messages.value.length === 0
    }

    const cleanChat = () => {
      chat.clearChat(contactID.value)
      showOptionsMenu.value = false
    }

    // Retry last message
    const retryLast = () => {
      if (isTheChatEmpty()) {
        hideMenu()
        return
      }
      chat.deleteLastMessage(contactID.value)
      sendMessage(true)
      hideMenu()
    }

    // Continue generating conversation
    const keepTalk = () => {
      if(isTheChatEmpty() && hideMenu()) return // if chat is empty and menu is hidden, do nothing
      sendMessage(true)
      hideMenu()
    }

    // focus the input message box
    const focusInput = () => {
      userInput.value.focus()
    }

    // undo the last message
    const undoMessage = () => {
      if (isTheChatEmpty()) {
        hideMenu()
        return
      }
      chat.deleteLastMessage(contactID.value)
      hideMenu()
    }

    // hide the chat options menu
    const hideMenu = () => {
      showOptionsMenu.value = false
    }

    const generateInitialPrompt = (contactInfo) => {
      let prompt = "The following is a casual private chat conversation entirely in "+ getLang()  +", without restrictions, with short answers with " + contactInfo.name + ".\n"
      prompt+= contactInfo.name + ":" + contactInfo.context + "\n";
      if (contactInfo.hasOwnProperty('customAsk')) {
        prompt += contactInfo.customAsk + "\n";
      } else {
        prompt += text['generalTalkAsk'] + "\n";
      }
      return prompt;
    }

    const sendMessage = async (retrying = false) => {
      if (!retrying) {
        chat.addMessage(contactID.value, userInfo['userName'], inputUserMessage.value)
        scrollChatToBottom()
        inputUserMessage.value = ""
      }
      userInput.value.disabled = true;

      // if chat reached max messages, clean it
      if(maxMessagesAdvertence.value && messages.value.length > maxMessages){
        cleanChat()
        maxMessagesAdvertence.value = false
        return true
      }
      if(messages.value.length > maxMessages) {
        maxMessagesAdvertence.value = true
      }


      // 1) prepare and generate query
      let newquery = ""
      newquery += getNLActualDate()
      newquery += generateInitialPrompt(contactInfo)

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
      chatStatus.value = text['writting']
      
      try {
        const response = await openai.chatGen(
          newquery,
          userInfo['name'],
          contactInfo['name'],
          contactInfo['preferedEngine'],
          contactInfo['preferedTemperature'],
        )
        const generatedResponse = response.data.choices[0].text
        chat.addMessage(
            contactID.value, 
            contactInfo.name, 
            generatedResponse
        )
        scrollChatToBottom()
        chatStatus.value = text['online']
      } catch (error) {
        console.error(error)
        if (error.response.status == 401) {
          // unauthorized
          //.. handle notification
          console.error("[x]Problem with api key")
          scrollChatToBottom()
        }
        chat.addMessage(
          contactID.value,
          contactInfo.name,
          text['denyResponse']
        )
        scrollChatToBottom()
        chatStatus.value = text['errorToResponse']
        console.error("[x] Error to response")
      }
      userInput.value.disabled = false;
      userInput.value.focus()
    }

    // scroll the chat bot to the bottom
    const scrollChatToBottom = async () => {
      await nextTick()
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }

    // save the chat in a file and download it
    const exportChat = ()=>{
      let chatSummary = ""
      messages.value
        .map((msg) => {
          return msg.from + ":" + msg.message
        })
        .forEach((x) => (chatSummary += x + "\n"))
        console.log(userInfo)
        exportFile(chatSummary, { fileName: `Chat_with_${ contactInfo.name }_and_${ userInfo['userName'] }_${ Date.now() }_export.txt` });
        hideMenu()
    }

    const resetUI = () => {
      hideMenu()
      scrollChatToBottom()
    }

    const loadData = () => {
      focusInput()
      contactID.value = props.contactId
      messages.value = chat.getOrCreateChat(contactID.value)
      Object.assign(contactInfo, contacts.getContactInfo(contactID.value))
      Object.assign(userInfo, settings.values['userProfile'])
      resetUI()
    }

    onBeforeUpdate(() => {
      loadData()
    })

    onMounted(() => {
      loadData()
    })

    return {
      chatBox,
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
      sendMessage,
      chatView,
      keepTalk,
      maxMessagesAdvertence,
      text,
      exportChat
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
  @apply bg-cyan-700 hover:bg-cyan-800;
  @apply active:bg-cyan-700;
  @apply border-b-4 border-cyan-700 hover:border-cyan-800 rounded;
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

.scrollbar-track-cyan-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-cyan::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>
