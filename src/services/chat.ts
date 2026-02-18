import { reactive } from "vue";
import * as store from "../utils/localStorage";
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

  loadFromStore() {
    const storechatHistory = store.read("chatHistory");
    if (storechatHistory) {
      Object.assign(this.messagesCollection, storechatHistory);
    }
  }

  getLastMessage(chatId: number): string {
    const allMessages = this.messagesCollection[chatId];
    if (allMessages && allMessages.length > 0) {
      return allMessages[allMessages.length - 1].message || '';
    }
    return '';
  }

  getLength(chatId: number): number {
    return this.messagesCollection[chatId]?.length || 0;
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
    console.info("All conversations deleted!");
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

  addMessage(id: number, sender: string, msgText: string): void {
    const chat = this.getOrCreateChat(id);

    // push the new message
    const chatId = chat.length;
    chat.push({
      id: chatId,
      message: msgText.trim(),
      from: sender,
      type: msgText.startsWith('*') && msgText.endsWith('*') ? 'action' : 'normal'
    });

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

const chat = new Chat();
chat.loadFromStore();

export default chat;

