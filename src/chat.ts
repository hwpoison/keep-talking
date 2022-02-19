import { reactive } from "vue";
import demoContacts from "./utils/contacts";
import * as store from "./utils/localStorage";

const userInfo = reactive({
  name: "Usuario"
});

let contacts = reactive({'list':[]})

let messagesCollection = reactive({});

const getUserInfo = (): Record<string, unknown> => {
  return userInfo;
};

const loadUserDataAndConfiguration = () => {
  // chat historial
  console.info("[+]Loading user info")
  const storeChatHistorial = store.read("chatHistorial");
  if (storeChatHistorial != null) {
    Object.assign(messagesCollection, storeChatHistorial);
  }
  // contact list
  const storeContacts = store.read("contacts");
  
  if (storeContacts != null){
    contacts.list = storeContacts.list
    console.log("recovering:", storeContacts)
  }
  Object.assign(contacts.list, demoContacts)

  // user basic information
  const storeUserInfo = store.read("userInfo");
  if (storeUserInfo != null) {
    Object.assign(userInfo, storeUserInfo);
  }
};

const getLastMessage = (contactId) : string => {
  let allMessages = messagesCollection[contactId]
  if(allMessages){
    let last = allMessages[Object.keys(allMessages).splice(-1)]
    return last?last.message:''
  }
}

const saveHistorial = (): void => {
  store.write("chatHistorial", messagesCollection);
};

const saveContacts = (): void => {
  store.write("contacts", contacts);
};

const saveUserInfo = (): void => {
  store.write("userInfo", userInfo);
};


const clearArray = (array) => {
  array.splice(0, array.length)
}

const clearObject = (object) => {
  Object.entries(object).forEach(idx=>{
    clearArray(object[idx[0]])
  })
}

const deleteAllConversations = (): void => {
  clearObject(messagesCollection)
  saveHistorial()
  console.log("[+] All conversations deleted!");
};

const deleteAllContacts = (): void => {
  contacts.list = []
  saveContacts()
  console.log("[+] All contacts deleted!");
};

const deleteAll = (): void => {
  console.log("All deleted!");
  deleteAllConversations();
  deleteAllContacts();
  saveHistorial();
  saveContacts();
};

const getOrCreateChat = (chatId: number): Record<string, unknown> => {
  if (!messagesCollection[chatId]) messagesCollection[chatId] = [];
  return messagesCollection[chatId];
};

const getContactInfo = (contactId: number): Record<string, unknown> => {
  const info = contacts.list.find((contact) => contact.id == contactId);
  if (info) return info;
};

const addNewContact = (contactInfo : Record<string, unknown>) => {
  contacts.list.push(contactInfo)
  saveContacts()
}

const addMessage = (chatId: number, sender: string, msgText: string): void => {
  messagesCollection[chatId].push({
    id: messagesCollection[chatId].length,
    message: msgText.trim(),
    from: sender,
  });
  const currentContact = getContactInfo(chatId)
  // move chat to top of contact list
  if(currentContact){
    const contactIndex = contacts.list.indexOf(currentContact)
    contacts.list.unshift(contacts.list.splice(contactIndex,1)[0])
  }
  saveContacts()
  saveHistorial()
};

const clearChat = (chatId: number): void => {
  clearArray(messagesCollection[chatId])
  saveHistorial();
};

const deleteLastMessage = (chatId: number): void => {
  const chat = messagesCollection[chatId];
  if (chat) {
    messagesCollection[chatId].pop(chat.length);
  }
  saveHistorial();
};

const changeUserName = (newName: string): void => {
  userInfo.name = newName;
};

export {
  getUserInfo,
  changeUserName,
  messagesCollection,
  addMessage,
  deleteAllConversations,
  contacts,
  deleteAllContacts,
  deleteAll,
  clearChat,
  deleteLastMessage,
  getOrCreateChat,
  getContactInfo,
  getLastMessage,
  addNewContact,
  saveContacts,
  saveUserInfo,
  loadUserDataAndConfiguration
};
