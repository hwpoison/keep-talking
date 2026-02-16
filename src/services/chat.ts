import { reactive } from "vue";
import * as store from "../utils/localStorage";
import contacts from "./contacts";
import { ChatMessage, Contact } from "../types";

const clearArray = (array: any[]) => {
  array.splice(0, array.length);
};

const clearObject = (object: Record<string, any[]>) => {
  Object.keys(object).forEach(key => {
    clearArray(object[key]);
  });
};

class Chat {
  messagesCollection: Record<number, ChatMessage[]> = reactive({});
  contacts: any;

  constructor(agenda: any) {
    this.contacts = agenda;
  }

  loadFromStore() {
    const storechatHistory = store.read("chatHistory");
    if (storechatHistory) {
      Object.assign(this.messagesCollection, storechatHistory);
    }
  }

  getLastMessage(contactId: number): string {
    const allMessages = this.messagesCollection[contactId];
    if (allMessages && allMessages.length > 0) {
      return allMessages[allMessages.length - 1].message || '';
    }
    return '';
  }

  getLength(contactId: number): number {
    return this.messagesCollection[contactId]?.length || 0;
  }

  clearChat(chatId: number): void {
    if (this.messagesCollection[chatId]) {
      clearArray(this.messagesCollection[chatId]);
      this.saveHistory();
    }
  }

  deleteAllConversations(): void {
    clearObject(this.messagesCollection);
    this.saveHistory();
    console.log("[+] All conversations deleted!");
  }

  getOrCreateChat(chatId: number): ChatMessage[] {
    if (!this.messagesCollection[chatId]) {
      this.messagesCollection[chatId] = [];
    }
    return this.messagesCollection[chatId];
  }

  saveHistory(): void {
    store.write("chatHistory", this.messagesCollection);
  }

  addMessage(chatId: number, sender: string, msgText: string): void {
    const chat = this.getOrCreateChat(chatId);

    chat.push({
      id: chat.length,
      message: msgText.trim(),
      from: sender,
      type: msgText.startsWith('*') && msgText.endsWith('*') ? 'action' : 'normal'
    });

    const currentContact = this.contacts.getContactInfo(chatId) as Contact;

    if (currentContact) {
      const contactList = this.contacts.getList() as Contact[];
      const contactIndex = contactList.indexOf(currentContact);
      if (contactIndex > -1) {
        contactList.unshift(contactList.splice(contactIndex, 1)[0]);
      }
    }
    this.contacts.saveList();
    this.saveHistory();
  }

  deleteLastMessage(chatId: number): void {
    const chat = this.messagesCollection[chatId];
    if (chat && chat.length > 0) {
      chat.pop();
      this.saveHistory();
    }
  }
}

const chat = new Chat(contacts);
chat.loadFromStore();

export default chat;

