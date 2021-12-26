<template>
  <div v-if="offlineReady || needRefresh">
    <ConfirmDialog ref="dialog"></ConfirmDialog>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import ConfirmDialog from '../components/ConfirmDialog.vue'

const { updateServiceWorker } = useRegisterSW();

export default {
  name: "ReloadPrompt",
  components:{
    ConfirmDialog
  },
  setup() {
    const dialog = ref(null)
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

    const close = async () : void => {
      offlineReady.value = false;
      needRefresh.value = false;
    }

    const updateSW = async () : void => {
      await updateServiceWorker();
    }

    const check = () : void => {
      if(offlineReady || needRefresh ){
        dialog.value.show = true 
        dialog.value.type = "success"
        let confirmReload = {
            title:'Novedades!',
            message: 'Se ha encontrado nuevo contenido disponible.',
            confirmationLabel:"Recargar",
            abortLabel:"Cerrar",
            onaccept: () => {updateSW();dialog.value.show=false},
            onabort: ()=>{close();dialog.value.show=false}
        }
        Object.assign(dialog.value.settings, confirmReload)
      }
    }

    setTimeout(()=>{check()},2000)

    return { offlineReady, needRefresh, updateServiceWorker, close, dialog };
  }
}
</script>