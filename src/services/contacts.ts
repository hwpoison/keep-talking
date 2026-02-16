import { ref } from "vue";
import * as store from "../utils/localStorage";
import demoContacts from "../utils/demoContacts";
import { Contact } from "../types";

class Contacts {
  list = ref<Contact[]>([]);

  saveList(): void {
    store.write("contacts", this.list.value);
  }

  loadFromStore() {
    console.info("[+] Loading contacts");
    const storeContacts = store.read("contacts");
    if (storeContacts === null) {
      this.loadDemoContacts();
      this.saveList();
    } else {
      this.list.value = storeContacts;
    }
  }

  loadDemoContacts() {
    this.list.value = demoContacts as Contact[];
  }

  deleteAllContacts(): void {
    this.list.value = [];
    this.saveList();
    console.log("[+] All contacts were deleted!");
  }

  getList(): Contact[] {
    return this.list.value;
  }

  createContact(contactInfo: Contact) {
    this.list.value.push(contactInfo);
    this.saveList();
  }

  getContactInfo(contactId: number): Contact | undefined {
    return this.list.value.find((contact) => contact.id === contactId);
  }
}

const contacts = new Contacts();

contacts.loadFromStore();

export default contacts;