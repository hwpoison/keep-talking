<template>
  <div v-if="offlineReady || needRefresh">
    <ConfirmDialog ref="dialog"></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import ConfirmDialog from '../components/ConfirmDialog.vue'
import chat from '../services/chat'
import contacts from '../services/contacts'
import { text } from '../services/language'

const dialog = ref<any>(null)
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async (): Promise<void> => {
  offlineReady.value = false;
  needRefresh.value = false;
}

const updateSW = async (): Promise<void> => {
  await updateServiceWorker();
}

const check = async (): Promise<void> => {
  if (offlineReady.value || needRefresh.value) {
    // Wait for the dialog to be rendered because of the v-if
    await nextTick();
    
    if (dialog.value) {
      dialog.value.type = "success"
      const confirmReload = {
        title: (text as any)['updateMessage'],
        message: (text as any)['updateMessage'],
        confirmationLabel: (text as any)['confirm'],
        abortLabel: (text as any)['close'],
        onaccept: () => {
          updateSW();
          if (dialog.value) dialog.value.show = false;
        },
        onabort: () => {
          close();
          if (dialog.value) dialog.value.show = false;
        }
      }
      Object.assign(dialog.value.settings, confirmReload)
      dialog.value.show = true
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    check()
  }, 2000)
})
</script>