<template>
  <div id="chat-view" :class="{
    'fixed inset-x-0 top-0': backMode,
    'absolute inset-0': !backMode
  }" class="flex flex-col" :style="ui.chatViewStyle" tabindex="0" @keyup.alt.r="ui.actionMenu.retryLast()"
    @keyup.ctrl.z="ui.actionMenu.undoMessage()" @keyup.alt.k="ui.actionMenu.keepTalk()"
    @keyup.alt.l="ui.actionMenu.cleanChat()">
    <NavBar :showBackButton="backMode">
      <template #navbar-title>
        <!-- Contact Information -->
        <div v-show="contactId != null" class="flex ml-2 mt-3">
          <div class="flex-none" id="contact-photo">
            <img :src="data.contactInfo.img" class="object-cover" alt="user image" />
          </div>
          <div class="text-left">
            <p id="contact-name" class="inline-block text-center px-3 text-2xl">
              {{ data.contactInfo.name }}
            </p>
            <p class="text-light text-md italic sm:pl-3 pl-3 flex items-center">
              <span v-if="ui.chatStatus == text.online"
                class="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              {{ ui.chatStatus }}
            </p>
          </div>
        </div>
      </template>
      <template #navbar-content>
        <!-- Chat Options Btn and Menu -->
        <div v-show="contactId != null" class="flex justify-end mt-4" style="width: 162px">
          <button @click="ui.showOptionsMenu = !ui.showOptionsMenu" id="dropdownSmallButton"
            class="mr-1 mb-1 md:mb-0 text-white focus:ring-4 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
            type="button">
            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
              <path
                d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
            </svg>
          </button>
        </div>
        <div class="absolute dropdown-wrapper">
          <transition name="slide-fade">
            <div class="flex" v-show="ui.showOptionsMenu">
              <ToClickOutside @click="ui.hideMenu()" />
              <div
                class="z-20 bg-cyan-600 border-2 border-cyan-700 dropdown-menu text-white rounded shadow-lg w-40 max-w-xs">
                <ul class="list-none overflow-hidden rounded">
                  <a @click="ui.actionMenu.undoMessage()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <UndoButton> {{ text.undo }} </UndoButton>
                  </a>
                  <a @click="ui.actionMenu.retryLast()"
                    class="flex py-2 px-3 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <RetryButton> {{ text.retry }} </RetryButton>
                  </a>
                  <a @click="ui.actionMenu.keepTalk()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <KeepTalkButton> {{ text.keepTalk }} </KeepTalkButton>
                  </a>
                  <a @click="ui.actionMenu.cleanChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <CleanButton> {{ text.emptyChat }} </CleanButton>
                  </a>
                  <a @click="ui.actionMenu.exportChat()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <SaveButton> {{ text.saveToFile }} </SaveButton>
                  </a>
                  <a @click="ui.actionMenu.deleteContact()"
                    class="flex py-2 px-2 transition duration-300 hover:bg-cyan-400 cursor-pointer">
                    <DeleteContactButton> {{ text.deleteContact }} </DeleteContactButton>
                  </a>
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
    <div class="flex-1 bg-gray-200 bg-gradient-to-b overflow-y-scroll from-gray-100" ref="chatBox"
      v-show="contactId != null">
      <div class="chat-message">
        <div class="chat-message-content font-sans p-3">
          <ul class="grid grid-cols-1">
            <transition-group name="list" tag="p">
              <div v-for="(entry, idx) in data.messages" class="flex flex-col" :key="idx">
                <!-- Message popup -->
                <div class="place-self-start text-left cursor-default py-2" :class="{
                  'pr-20': entry.from == data.contactInfo.name,
                  'place-self-end pl-20': entry.from != data.contactInfo.name,
                }">
                  <!-- Message content -->
                  <div class="bg-white p-3 word-break rounded-r-lg rounded-1 shadow" :class="{
                    'bg-green-100 rounded-l-lg': entry.from != data.contactInfo.name,
                    'bg-cyan-600 rounded-lg text-white': entry.type == 'action'
                  }" v-html="marked(entry.message)">
                  </div>
                </div>
              </div>
            </transition-group>
          </ul>
        </div>
      </div>
    </div>

    <!-- Message input box -->
    <div v-show='ui.maxMessagesAdvertence'> <span class="font-light"> {{ text.reachedLimit }} </span></div>
    <form id="input-form" class="flex justify-between bottom-0" @submit.prevent="sendMessage(); ui.scrollChatToBottom()"
      v-show="contactId != null">
      <input type="text" ref="userInput" v-model="ui.inputMessage" name="chat-input" id="chat-input"
        class="relative grow transition duration-500 border border-transparent focus:outline-none py-1 pb-2 px-4 rounded-none"
        :placeholder="text.writeSomething" maxlength="400" autocomplete="off" autocorrect="true" autocapitalize="off"
        spellcheck="true" required @focus="ui.onInputFocus" />
      <button class="flex-none" id="input-btn"> {{ text.send }} </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { saveToFile } from '../utils/file';
import { sleep } from '../utils/sleep';
import { marked } from 'marked';
import { isTheChatEmpty, getSystemPrompt } from '../utils/chatUtils';
import { deviceType } from '../utils/detectDevice';
import { viewport } from '../services/viewport';
import { navigation } from "../services/navigation";
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
import DeleteContactButton from "../components/Buttons/DeleteContactButton.vue";

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
    SaveButton,
    DeleteContactButton
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
    const ui : any = reactive({
      chatStatus: text.online,
      inputMessage: "",
      showOptionsMenu: false,
      viewportHeight: window.visualViewport?.height || window.innerHeight,
      maxMessagesAdvertence: false,
      actionMenu: {} 
    });

    const data = reactive({
      contactID: null as number | null,
      userInfo: { userName: "User" } as UserProfile,
      contactInfo: { img: "", name: "", context: "" } as Contact,
      messages: [] as ChatMessage[],
      maxMessages: settings.values['maxMessages'] || 50
    })

    const dom = {
      chatBox: ref<HTMLElement | null>(null),
      userInput: ref<HTMLInputElement | null>(null)
    };

    const router = useRouter();

    ui.updateViewportHeight = () => {
      if (window.visualViewport) {
        ui.viewportHeight = window.visualViewport.height;
      } else {
        ui.viewportHeight = window.innerHeight;
      }
      ui.scrollChatToBottom();
    };

    ui.scrollChatToBottom = async () => {
      await nextTick();
      if (dom.chatBox.value) {
        dom.chatBox.value.scrollTop = dom.chatBox.value.scrollHeight;
      }
    }

    ui.chatViewStyle = computed(() => ({
      height: `${ui.viewportHeight}px`,
    }));

    ui.updateTitle = () => {
      document.title = data.contactInfo.name ? `${data.contactInfo.name} - Keep Talking` : 'Keep Talking';
    };

    // load all contact data
    const loadData = () => {
      if (props.contactId === null) return;

      // get chat id
      data.contactID = Number(props.contactId);

      // load contact chat or create new if doesn't exists
      data.messages = chat.getOrCreateChat(data.contactID) as ChatMessage[];

      // load all contact info
      const info = contacts.get(data.contactID);
      if (info) Object.assign(data.contactInfo, info);

      Object.assign(data.userInfo, settings.values['userProfile']);
      ui.updateTitle();

      ui.hideMenu();
      ui.scrollChatToBottom();
      if (deviceType() !== 'mobile') {
        nextTick(() => dom.userInput.value?.focus());
      }
    };

    const checkViewportAndRedirect = () => {
      console.info(`[Chat] Checking viewport: ${viewport.type.value}, backMode: ${props.backMode}`);
      if (props.backMode && viewport.type.value === 'desktop') {
        console.info(`[Chat] Redirecting to home (desktop)`);
        router.replace('/');
      }
    };

    ui.hideMenu = () => { ui.showOptionsMenu = false; };

    ui.actionMenu.cleanChat = () => {
      if (data.contactID !== null) chat.clearChat(data.contactID);
      ui.hideMenu();
    };

    ui.actionMenu.undoMessage = () => {
      if (isTheChatEmpty(ref(data.messages)) || data.contactID === null) return ui.hideMenu();
      chat.deleteLastMessage(data.contactID);
      ui.hideMenu();
    };

    ui.actionMenu.retryLast = () => {
      if (isTheChatEmpty(ref(data.messages)) || data.contactID === null) return ui.hideMenu();
      chat.deleteLastMessage(data.contactID);
      sendMessage(true);
      ui.hideMenu();
    };

    ui.actionMenu.keepTalk = () => {
      if (isTheChatEmpty(ref(data.messages))) return ui.hideMenu();
      sendMessage(true);
      ui.hideMenu();
    };

    ui.actionMenu.deleteContact = () => {
      contacts.delete(data.contactID);
      contacts.saveAll();
      router.replace('/');
      navigation.clearActiveContact();
    }

    ui.actionMenu.exportChat = () => {
      const summary = data.messages.map(m => `${m.from}:${m.message}`).join("\n");
      saveToFile(summary, { fileName: `Chat_with_${data.contactInfo.name}_${Date.now()}.txt` });
      ui.hideMenu();
    };

    ui.onInputFocus = () => {
      if (deviceType() === 'mobile') {
        ui.scrollChatToBottom();
      }
    };

    watch(() => props.contactId, loadData);
    watch(viewport.type, checkViewportAndRedirect);

    onMounted(() => {
      loadData();
      window.visualViewport?.addEventListener('resize', ui.updateViewportHeight);
      window.visualViewport?.addEventListener('scroll', ui.updateViewportHeight);
      checkViewportAndRedirect();
    });

    onUnmounted(() => {
      window.visualViewport?.removeEventListener('resize', ui.updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', ui.updateViewportHeight);
    });

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
      if (data.contactID === null) return;

      contacts.moveToTop(data.contactID);
      if (!retrying) {
        chat.addMessage(data.contactID, data.userInfo.userName, ui.inputMessage);
        ui.inputMessage = "";
      }

      if (dom.userInput.value) dom.userInput.value.disabled = true;

      if (ui.maxMessagesAdvertence && data.messages.length > data.maxMessages) {
        ui.actionMenu.cleanChat();
        ui.maxMessagesAdvertence = false;
        if (dom.userInput.value) dom.userInput.value.disabled = false;
        return;
      }

      if (data.messages.length > data.maxMessages) ui.maxMessagesAdvertence = true;

      const messagesToSend = [
        { role: 'system', content: `${getNLActualDate()}\n${getSystemPrompt(data.contactInfo, text as any)}` },
        ...data.messages.map(msg => ({
          role: msg.from === data.userInfo.userName ? 'user' : 'assistant',
          content: msg.message
        }))
      ];

      ui.chatStatus = text.writting;

      try {
        const response = await openai.chatGen(
          messagesToSend as any,
          data.contactInfo.preferedEngine || null,
          data.contactInfo.preferedTemperature || null
        );

        const { reasoning, content } = extractReasoning(response.choices[0].message);

        let delay = 1000 + Math.random() * 1000;
        if (reasoning && openai.configuration.showReasoning) {
          delay += Math.min(reasoning.length * 2, 5000);
        }

        await sleep(delay);

        if (content.trim()) {
          chat.addMessage(data.contactID, data.contactInfo.name, content);
        } else {
          console.warn("AI returned empty content.");
        }

        ui.chatStatus = text.online;
      } catch (error: any) {
        console.error("Chat error:", error);
        chat.addMessage(data.contactID, data.contactInfo.name, text.denyResponse);
        ui.chatStatus = text.errorToResponse;
      } finally {
        if (dom.userInput.value) {
          dom.userInput.value.disabled = false;
          if (deviceType() !== 'mobile') {
            dom.userInput.value.focus();
          }
        }
      }
      ui.scrollChatToBottom();
    };

    return {
      ui, data, dom,
      chatBox: dom.chatBox,
      userInput: dom.userInput,
      sendMessage,
      text,
      marked
    };
  },
});
</script>

<style scoped>
#contact-photo>img {
  @apply w-14 h-14 rounded-full border border-gray-400 shadow-sm;
}

#input-btn {
  @apply text-white font-bold py-2 px-4 transition duration-500 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-700 border-b-4 border-cyan-700 hover:border-cyan-800 rounded;
}

.list-enter-active {
  transition: all 0.3s;
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
</style>
