import { ref, reactive } from "vue";
import * as store from "./utils/localStorage";

import demoContacts from "./utils/demoContacts";

class Contacts {
    list = ref([])
  
    saveList(): void {
      store.write("contacts", this.list.value);
    };
  
    loadFromStore(){
      // contact list
      console.info("[+] Loading contacts")
      const storeContacts = store.read("contacts");
      if (storeContacts != null){
        this.list.value = storeContacts
      }
      if(this.getList().length == 0){
        this.list.value = demoContacts
        // Object.assign(contacts.list, demoContacts)
      }
    }
    
    deleteAllContacts(): void {
      this.list.value = []
      this.saveList()
      console.log("[+] All contacts were deleted!");
    };
  
    getList(){
      return this.list.value
    }
  
    createContact(contactInfo : Record<string, unknown>){
      this.getList().push(contactInfo)
      this.saveList()
    }
  
    getContactInfo(contactId: number): Record<string, unknown> {
      const info = this.list.value.find((contact) => contact.id == contactId);
      if (info) return info;
    };
}

const contacts = new Contacts()
contacts.loadFromStore()

export default contacts;