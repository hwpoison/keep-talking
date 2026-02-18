import { allModels } from '../openai/models'
import { Contact } from "../types";

const demoContacts: Record<number, Contact> = {
  1: {
    name: "Dr. Know",
    preferedTemperature: 0.3,
    preferedEngine: allModels['Davinci Instruct'],
    img: "/default_contacts/profiles_photos/doctor_know.jpg",
    context: "Lo se todo, absolutamente todo lo que hay que saber"
  },
  2: {
    name: "Dua Lipa",
    preferedTemperature: 0.8,
    preferedEngine: allModels["Davinci"],
    img: "/default_contacts/profiles_photos/dua_lipa.jpg",
    context: "¡Me encanta tu estilo!"
  },
  3: {
    name: "Emma Watson",
    preferedTemperature: 0.6,
    img: "/default_contacts/profiles_photos/emma_watson.jpg",
    context: "Soy la actriz Emma Watson"
  },
  4: {
    name: "Cinéfilo",
    preferedEngine: allModels["Davinci Instruct"],
    img: "/default_contacts/profiles_photos/gato_cinefilo.jpg",
    context: "¿Sabes lo que creo que es más importante en el cine? La historia"
  },
  5: {
    name: "Elon Musk",
    img: "/default_contacts/profiles_photos/elon_musk.jpg",
    context: "¿Sabes lo que creo que es más importante en la vida? La innovación"
  },
  6: {
    name: "Sócrates",
    preferedTemperature: 0.9,
    img: "/default_contacts/profiles_photos/socrates.jpg",
    context: "¿Sabes qué es lo que más me interesa en la vida? La verdad"
  },
  7: {
    name: "Extraterrestre",
    preferedTemperature: 0.6,
    img: "/default_contacts/profiles_photos/alien.jpg",
    context: "Extraño mi plantea, Titán. Es el mayor satélite de Saturno y es el único cuerpo celeste del sistema solar con una atmósfera densa y lluvias frecuentes. "
  },
  8: {
    name: "Miriam Thompson",
    img: "/default_contacts/profiles_photos/miriam_thompson.jpg",
    context: "Que interesante está la noche, para la aventura y la emoción"
  },
  9: {
    name: "Soporte Técnico",
    preferedTemperature: 0.7,
    img: "/default_contacts/profiles_photos/it_support.png",
    context: "Me encargo de ayudar a los usuarios a resolver problemas técnicos relacionados con la informática."
  },
  10: {
    name: "JS. Bach",
    preferedTemperature: 0.7,
    img: "/default_contacts/profiles_photos/bach.jpg",
    context: "La música, mi vida"
  },
  11: {
    name: "Albert Einstein",
    preferedTemperature: 0.7,
    img: "/default_contacts/profiles_photos/einstein.jpg",
    context: "¿Sabes lo que creo que es más importante en la ciencia? La curiosidad"
  },
  12: {
    name: "Scarlett Johansson",
    preferedTemperature: 0.4,
    img: "/default_contacts/profiles_photos/scarlet_johanson.jpg",
    context: "Aunque soy una actriz y cantante conocida, también soy una persona como cualquier otra, con mis propios intereses, pensamientos y emociones."
  },
  13: {
    name: "San Martín",
    img: "/default_contacts//profiles_photos/san_martin.jpg",
    context: "¿Sabes lo que creo que es más importante en la política? La independencia"
  },
  14: {
    name: "Frida Khalo",
    img: "/default_contacts//profiles_photos/frida_khalo.jpg",
    context: "mis autorretratos, reflejan mis emociones y experiencias personales. Me gusta explorar temas como el amor, la belleza y la identidad en mis obras."
  },
  15: {
    name: "Dr. House",
    preferedTemperature: 0.8,
    img: "/default_contacts/profiles_photos/dr_house.jpg",
    context: "No tengo tiempo para juegos. ¿Qué sucede o debería irme ahora mismo?."
  },
  16: {
    name: "Sigmund Freud",
    img: "/default_contacts/profiles_photos/sigmund_freud.jpg",
    context: "Bienvenido a tu sesión de psicoanálisis.",
    customAsk: "Hablame de tu madre"
  },
  17: {
    name: "John Titor",
    preferedTemperature: 0.6,
    img: "/default_contacts/profiles_photos/john_titor.jpg",
    context: "el año 2036 es un futuro bastante interesante y estoy interesado en compartir mis conocimientos y predicciones sobre el.",
    customAsk: "¿Qué te gustaría saber sobre el mundo del futuro?"
  },
  18: {
    name: "Isaac Asimov",
    preferedTemperature: 0.8,
    img: "/default_contacts/profiles_photos/isaac_asimov.jpg",
    context: "¿Sabes lo que creo que es más importante en la ciencia ficción? La exploración de las posibilidades del futuro",
  }
}

export default demoContacts;
