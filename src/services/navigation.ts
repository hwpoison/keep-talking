import { ref } from 'vue';

class Navigation {
    activeContactId = ref<number | null>(null);

    setActiveContact(id: number | null) {
        this.activeContactId.value = id;
    }

    clearActiveContact() {
        this.activeContactId.value = null;
    }
}

export const navigation = new Navigation();
export default navigation;
