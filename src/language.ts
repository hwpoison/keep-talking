import settings from './settingsManager'
import { reactive  } from 'vue'

let messages = {
    spanish:{
        advertiseMessage:"Advertencia",
        settings:"Configuraciones",
        startToChat:"Selecciona a alguien y comienza a conversar",
        about:"Acerca de Keep Talking",
        send:"Enviar",
        undo:"Deshacer",
        retry:"Reintentar",
        keepTalk:"Keep talk",
        emptyChat:"Vaciar Chat",
        writeSomething:"Escribe algo",
        yourName:"Tu nombre",
        openAIKey:"Open AI API Key",
        defaultModel:"Modelo por defecto",
        deleteAllChats:"Eliminar conversaciones",
        deleteAllContacts:"Eliminar contactos",
        deleteAll:"Eliminar todo",
        user:"Usuario",
        reachedLimit:"Se ha llegado al tope de mensajes, se vaciará la caja de mensajes en el proximo envío.",
        updates:"Novedades!",
        updateMessage:"Se ha encontrado una nueva versión disponible",
        reload:"Recargar",
        close:"Cerrar",
        addNewContact:"Añadir nuevo contacto",
        contactAdded:"Contacto Añadido",
        photo:"Foto",
        description:"Descripción",
        tags:"Etiquetas",
        done:"Listo",
        confirm:"Confirmar",
        denyResponse:"Lo siento, no puedo responderte en este momento",
        online:"En línea",
        errorToResponse:"No disponible (Error general) ⚠️",
        writting:"Escribiendo...",
        selectLang:"Seleccionar lenguaje",
        todayIs:"Hoy es",
        saveToFile:"Descargar",
        generalTalkAsk:"¿Sobre qué te gustaría hablar?"
    },
    english:{
        advertiseMessage:"Advertence!",
        settings:"Settings",
        startToChat:"Choice someone and start chat!",
        about:"About Keep Talking",
        send:"Send",
        undo:"Undo",
        retry:"Retry",
        keepTalk:"Keep talk",
        emptyChat:"Clear chat",
        writeSomething:"Write something",
        yourName:"Your name",
        openAIKey:"Open AI API Key",
        defaultModel:"Default model",
        deleteAllChats:"Delete chats",
        deleteAllContacts:"Delete contacts",
        deleteAll:"Delete all",
        user:"User",
        reachedLimit:"You reached the limit, the chat will be empty at the next message.",
        updates:"News!",
        updateMessage:"New version is available",
        reload:"Reload",
        close:"Close",
        addNewContact:"Add new contact",
        contactAdded:"Contact added",
        photo:"Photo",
        description:"Description",
        tags:"Tags",
        done:"Done",
        confirm:"Confirm",
        denyResponse:"Sorry, i cant talk now",
        online:"Online",
        errorToResponse:"Offline (General Error) ⚠️",
        writting:"Typing...",
        selectLang:"Select lang",
        todayIs:"Today is",
        saveToFile:"Save",
        generalTalkAsk:"What would you like to talk about?"

    }
}

let allLabels = reactive({})

const setLang = (lang : string)=> {
    Object.assign(allLabels, messages[settings.language.get()] );
}

const getLang = ()=>{
    return settings.language.get()
}

setLang(settings.values['lang'])

export { allLabels, setLang, getLang }