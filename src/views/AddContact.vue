<template>
  <NavBar :showBackButton=true>
    <template #navbar-content> 
      <p class="text-2xl font-light mt-3">Añadir nuevo contacto</p>
    </template>
  </NavBar> 
  <div class="mt-16 py-5 rounded-3 select-none">
    <div v-show="confirmationNotification" class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
      <p class="font-bold">Listo</p>
      <p class="text-sm">El contacto ha sido añadido correctamente</p>
    </div>
  </div>
  <div>
    <form @submit.prevent="confirmContact()">
      <label class="text-2xl font-light text-gray-500  select-none" for="contact-name">Nombre</label><br>
      <input v-model="contactInfo.name" type="text" id="contact-name" name="contact-name" class="font-monospace p-3 w-4/5 h-12 border border-b-4" placeholder="Toda personas tienen un nombre..." required><br><br>
      
      <label class="text-2xl font-light select-none text-gray-500" for="contact-description">Descripción</label><br>
      <textarea class="border border-b-4 p-2 " v-model="contactInfo.description" style="width:80%" name="contact-description">
      </textarea>
      <br><br>
      <label class="text-2xl font-light select-none text-gray-500" for="contact-description">Etiquetas</label><br>
      <input class="border py-3 border-b-4 p-3 placeholder:italic placeholder:text-gray-400 " placeholder="Cualidades o detalles de la persona separadas por coma" v-model="contactInfo.tags" style="width:80%" name="contact-description" required><br><br>

      <label class="text-2xl font-light select-none text-gray-500" for="contact-description">Foto</label><br>
      <input class="border py-3 border-b-4 p-3 placeholder:italic placeholder:text-gray-400 " placeholder="Link de una imagen (no obligatoria)" v-model="contactInfo.img" style="width:80%" name="contact-description">

      <div class="mt-4">
        <button class="mt-3 object-center transition duration-500 bg-blue-500 hover:bg-blue-400 active:bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Confirmar
        </button> 
      </div>
      <br>
      <br>
      </form>
  </div>
</template>
<script>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { allContacts, saveContacts } from '@/chat.ts'
export default {
  name:'AddNewContact',
  components:{
    NavBar
  },
  // eslint-disable-next-line
  setup(){
    const confirmationNotification = ref(false)

    const contactInfo = ref({
      name: '',
      description: '',
      tags: '',
      img:''
    })

    const confirmContact = ()=>{
      const newContact = {
        id:allContacts.length+1,
        name:contactInfo.value.name,
        img:contactInfo.value.img?contactInfo.value.img:"https://madridsalud.es/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png",
        context:'Lo siguiente es una conversación con ' + contactInfo.value.name,
        personality:{
          description:contactInfo.value.description,
          cualidades:Array.from(contactInfo.value.tags.split(","),str=>str.trim())
        }
      }
      allContacts.push(newContact)
      confirmationNotification.value = true
      contactInfo.value.name = '' // re
      contactInfo.value.description = ''
      contactInfo.value.tags = ''
      saveContacts()
    }

    return {
      contactInfo,
      confirmContact,
      confirmationNotification
    }
  }
}
</script>