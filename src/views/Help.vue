<template>
	<NavBar :showBackButton=true>
		<template #navbar-title>
			<p class="text-2xl font-light justify-self-start mt-6 ml-2">Acerca de Keep Talking<span style="padding-left:1px; font-size:9px" class="absolute" >v0.5</span></p>
		</template>
	</NavBar>
	<div id="help-view" class="mx-3 mt-24">
		<h1 class="text-left" style="font-size:25px"></h1>
		<p class="text-left text-xl"><strong>Keep Talking</strong> es un experimento que utiliza inteligencia artificial
		para simular el comportamiento de personas para mantener chats con ellas. Puedes dialogar con personalidades famosas, de alguna serie o hasta algún cantante favorito y pasar un rato, preguntarle o comentarle cosas y recibir una respuesta.</p>
		<br>
		<h1 class="text-left" style="font-size:25px">🤖 Tipos de chats</h1>
		<p class="text-left">Existen dos tipos principales de contactos, los tipicos y los instructores.
		</p>
		<lu class="text-left">
			<li><strong>Típicos: </strong> Sirven para conversar trivialidades y emular caractisticas de una personalidad.</li>
			<li><strong>Instructores: </strong>Están especializados en brindar explicaciónes y definiciones acerca de diferentes conceptos, se manejan muy bien por medio de instrucciónes y pueden formular respuestas, entre ellos está el contacto de Soporte Técnico y Dr. Know.</li>
		</lu>
		<br>
		<h1 class="text-left" style="font-size:25px">😬 Limitaciones</h1>
		<p class="text-left">La inteligencia artifical no es perfecta, a veces puede no seguirte el hilo, ser inconsistente entre respuestas, decir cosas ofensivas y hasta a veces encerrarse en un bucle 😕. Pero tranquilo! Existen opciones para hacer llevadera la experiencia.</p>
		<lu class="text-left">
			<li>Puedes Deshacer/Reformular el último dialogo.</li>
			<li>Modificar las preferencias del contacto</li>
			<li>Tratar de ser especifico en tus consultas</li>
		</lu>
		<br>
		<h1 class="text-left" style="font-size:25px">⚠️Advertencia</h1>
		<p class="text-left">El objetivo es divertirse pero siempre es bueno tener algunas consideraciones:</p>
		<lu class="text-left">
			<li>Esto no tiene fines de apoyo terapeutico ni emocionales.</li>
			<li>GPT-3 se ha entrenado con mucho conocimiento de la internet, esto incluye contenido sesgado por el odio, por lo que pueden surgir situaciones en la que presente planteos incomodos o incriminatorios.</li>
			<li>Recuerda que simplemente estás hablando con un generador de texto, nada de esto es real</li>
		</lu>
		<br>
		<h1 class="text-left" style="font-size:25px">📚 Aspectos técnicos</h1>
		<p class="text-left">Esta aplicación se apoya en el modelo de Deep Learning GPT-3 creado por OpenAI, un modelo especializado en la generación de texto por medio de predicciónes en base a un contexto. Por lo tanto nada de lo que se genere ha sido programado, si no que ha sido producto de un modelo generacional. Se ha adaptado la entrada del modelo para que analice un esquema tipico conversacional, de esta manera emulando un dialogo.</p>
		<p class="text-left">Si bien GPT-3 fue entrenado en su mayoría con contenido en inglés, maneja muy bien el español con un gran grado de coherencia.</p>
		<br><br><br>
		<footer class="text-light">- Created by <a href="https://github.com/hwpoison/keep-talking">hwpoison</a> - 2021 -</footer>
</div>
</template>
<script>
import NavBar from '@/components/NavBar.vue'
export default {
	name:'Help',
	components:{
		NavBar
	}
}
</script>
