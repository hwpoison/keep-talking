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
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400 cursor-pointer"
                    ><UndoButton
                  > {{ text.undo }} </UndoButton></a>
                  <a
                    @click="retryLast()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400 cursor-pointer"
                    ><RetryButton
                    > {{ text.retry }} </RetryButton> </a>
                  <a
                    @click="keepTalk()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer"
                    ><KeepTalkButton
                  > {{ text.keepTalk }} </KeepTalkButton></a>
                  <a
                    @click="cleanChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer"
                    ><CleanButton
                  > {{ text.emptyChat }} </CleanButton></a>
                  <a
                    @click="exportChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer"
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
              </div>
            </transition-group>
          </ul>
        </div>
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
        v-model="inputMessage"
        class="relative grow transition duration-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent py-1 pb-2 px-4 rounded-none"
        :placeholder="text.writeSomething"
        maxlength="250"
        required
      />
      <button class="flex-none" id="input-btn"> {{ text.send }} </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch, nextTick } from "vue";
import { saveToFile } from '../utils/file';
import { sleep } from '../utils/sleep';
import { isTheChatEmpty, getSystemPrompt, scrollChatToBottom } from '../utils/chatUtils';
import { deviceType } from '../utils/detectDevice';
import { openai } from "../openai/openai";
import settings from '../services/settings';
import contacts from "../services/contacts";
import chat from "../services/chat";
import { text } from "../services/language";
import { getNLActualDate } from "../utils/date";
import { Contact, ChatMessage, UserProfile } from "../types";

import Logo from "../components/Logo.vue";
import NavBar from "../components/NavBar.vue";
import SaveButton from "../components/Buttons/SaveButton.vue";
import ToClickOutside from "../components/ToClickOutside.vue";
import UndoButton from "../components/Buttons/UndoButton.vue";
import CleanButton from "../components/Buttons/CleanButton.vue";
import RetryButton from "../components/Buttons/RetryButton.vue";
import KeepTalkButton from "../components/Buttons/KeepTalkButton.vue";

export default defineComponent({
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
      type: [Number, String],
      default: null,
    },
    backMode: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const chatView = ref<HTMLElement | null>(null);
    const chatBox = ref<HTMLElement | null>(null);
    const userInput = ref<HTMLInputElement | null>(null);
    const chatStatus = ref(text.online);
    const inputMessage = ref("");
    const showOptionsMenu = ref(false);
    const userInfo = reactive<UserProfile>({ userName: "User" });
    const contactID = ref<number | null>(null);
    const contactInfo = reactive<Contact>({ id: 0, img: "", name: "", context: "" });
    const messages = ref<ChatMessage[]>([]);
    const maxMessagesAdvertence = ref(false);
    const maxMessages = settings.values['maxMessages'] || 50;

    const loadData = () => {
      if (props.contactId === null) return;
      
      contactID.value = Number(props.contactId);
      messages.value = chat.getOrCreateChat(contactID.value) as ChatMessage[];
      
      const info = contacts.getContactInfo(contactID.value);
      if (info) Object.assign(contactInfo, info);
      
      Object.assign(userInfo, settings.values['userProfile']);
      
      hideMenu();
      scrollChatToBottom(chatBox);
      if (deviceType() !== 'mobile') {
        nextTick(() => userInput.value?.focus());
      }
    };

    watch(() => props.contactId, loadData);

    onMounted(loadData);

    const hideMenu = () => { showOptionsMenu.value = false; };

    const cleanChat = () => {
      if (contactID.value !== null) chat.clearChat(contactID.value);
      hideMenu();
    };

    const undoMessage = () => {
      if (isTheChatEmpty(ref(messages)) || contactID.value === null) return hideMenu();
      chat.deleteLastMessage(contactID.value);
      hideMenu();
    };

    const retryLast = () => {
      if (isTheChatEmpty(ref(messages)) || contactID.value === null) return hideMenu();
      chat.deleteLastMessage(contactID.value);
      sendMessage(true);
      hideMenu();
    };

    const keepTalk = () => {
      if (isTheChatEmpty(ref(messages))) return hideMenu();
      sendMessage(true);
      hideMenu();
    };

    const extractReasoning = (message: any) => {
        let reasoning = message.reasoning_content || message.reasoning || "";
        let content = message.content || "";

        if (!reasoning) {
            if (content.includes("<think>")) {
                const parts = content.split("</think>");
                reasoning = parts[0].replace("<think>", "").trim();
                content = parts[1]?.trim() || "";
            } else if (content.includes("<thought>")) {
                const parts = content.split("</thought>");
                reasoning = parts[0].replace("<thought>", "").trim();
                content = parts[1]?.trim() || "";
            }
        }
        return { reasoning, content };
    };

    const sendMessage = async (retrying = false) => {
      if (contactID.value === null) return;

      if (!retrying) {
        chat.addMessage(contactID.value, userInfo.userName, inputMessage.value);
        scrollChatToBottom(chatBox);
        inputMessage.value = "";
      }

      if (userInput.value) userInput.value.disabled = true;

      if (maxMessagesAdvertence.value && messages.value.length > maxMessages) {
        cleanChat();
        maxMessagesAdvertence.value = false;
        if (userInput.value) userInput.value.disabled = false;
        return;
      }
      
      if (messages.value.length > maxMessages) maxMessagesAdvertence.value = true;

      const messagesToSend = [
        { role: 'system', content: `${getNLActualDate()}\n${getSystemPrompt(contactInfo, text as any)}` },
        ...messages.value.map(msg => ({
          role: msg.from === userInfo.userName ? 'user' : 'assistant',
          content: msg.message
        }))
      ];

      chatStatus.value = text.writting;
      
      try {
        const response = await openai.chatGen(
          messagesToSend as any,
          contactInfo.preferedEngine || null,
          contactInfo.preferedTemperature || null
        );
        
        const { reasoning, content } = extractReasoning(response.choices[0].message);

        let delay = 1000 + Math.random() * 1000;
        if (reasoning && openai.configuration.showReasoning) {
            delay += Math.min(reasoning.length * 2, 5000);
        }

        await sleep(delay);

        if (content.trim()) {
            chat.addMessage(contactID.value, contactInfo.name, content);
        } else {
            console.warn("=> AI returned empty content.");
        }
        
        scrollChatToBottom(chatBox);
        chatStatus.value = text.online;
      } catch (error: any) {
        console.error("Chat error:", error);
        chat.addMessage(contactID.value, contactInfo.name, text.denyResponse);
        chatStatus.value = text.errorToResponse;
        scrollChatToBottom(chatBox);
      } finally {
        if (userInput.value) {
            userInput.value.disabled = false;
            if (deviceType() !== 'mobile') {
              userInput.value.focus();
            }
        }
      }
    };

    const exportChat = () => {
      const summary = messages.value.map(m => `${m.from}:${m.message}`).join("\n");
      saveToFile(summary, { fileName: `Chat_with_${contactInfo.name}_${Date.now()}.txt` });
      hideMenu();
    };

    return {
      chatView, chatBox, userInput, contactInfo, messages, cleanChat, 
      showOptionsMenu, hideMenu, userInfo, retryLast, undoMessage, 
      chatStatus, inputMessage, sendMessage, keepTalk, 
      maxMessagesAdvertence, text, exportChat
    };
  },
});
</script>

<style scoped>
#contact-photo > img {
  @apply w-14 h-14 rounded-full border border-gray-400 shadow-sm;
}

#input-btn {
  @apply text-white font-bold py-2 px-4 transition duration-500 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-700 border-b-4 border-cyan-700 hover:border-cyan-800 rounded;
}

.list-enter-active { transition: all 0.3s; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-30px); }

.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }
</style>

