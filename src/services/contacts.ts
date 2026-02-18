import { reactive, ref, Ref } from "vue";
import * as store from "../utils/localStorage";
import demoContacts from "../utils/demoContacts";
import { Contact } from "../types";
/* eslint-disable */
class Contacts {
  list: Map<number, Contact> = reactive(new Map());

  saveAll(): void {
    store.write("contacts", Array.from(this.list.entries()));
  }

  loadFromStore() {
    console.info("[+] Loading contacts");
    const storeContacts = store.read("contacts");
    if (storeContacts === null) {
      this.loadDemoContacts();
      this.saveAll();
    } else {
      this.list = new Map(storeContacts);
    }
  }

  loadDemoContacts() {
    console.info("Loading demo contacts ", demoContacts);
    this.list = new Map(
      Object.entries(demoContacts).map(([k, v]) => [Number(k), v])
    );
  }

  deleteAll(): void {
    this.list = new Map();
    this.saveAll();
    console.info("All contacts were deleted!");
  }

  delete(contactId: number): Boolean {
    if (this.list.has(contactId)) {
      this.list.delete(contactId);
      return true;
    }
    return false;
  }

  getAll(): Map<number, Contact> {
    return this.list;
  }

  add(contactInfo: Contact) {
    this.list.set(this.list.size + 1, contactInfo);
    this.saveAll();
  }

  get(contactId: number): Contact | undefined {
    return this.list.get(contactId);
  }

  moveToTop(contactId: number): void {
    const contact = this.list.get(contactId);
    if (!contact) return;
    this.list = new Map([
      [contactId, contact],
      ...[...this.list.entries()].filter(([id]) => id !== contactId)
    ]);
    this.saveAll();
  }
}

const contacts = new Contacts();
contacts.loadFromStore();
export default contacts;
