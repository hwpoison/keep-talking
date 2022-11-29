<template>
<div id="help-view" class="absolute inset-0 flex flex-col">
	<NavBar :showBackButton=true>
		<template #navbar-title>
			<p class="text-2xl font-light justify-self-start mt-6 ml-2">Acerca de Keep Talking<span style="padding-left:1px; font-size:9px" class="absolute" >v1.1</span></p>
		</template>
	</NavBar>
		<div class="flex-1 px-2 p-4 overflow-y-scroll">
			<h1 class="text-left" style="font-size:25px"></h1>
			<p class="text-left text-xl"><strong>Keep Talking</strong> utiliza inteligencia artificial para simular conversaciones. Puedes dialogar con personalidades famosas, de alguna serie o hasta algún cantante favorito y pasar un rato, preguntarle o comentarle cosas y recibir una respuesta.</p>
			<br>
			<h1 class="text-left" style="font-size:25px">😬 Limitaciones</h1>
			<p class="text-left">La inteligencia artifical no es perfecta, a veces puede no seguirte el hilo, ser inconsistente entre respuestas, decir cosas ofensivas y hasta a veces encerrarse en un bucle 😕. Pero tranquilo! Existen opciones para hacer llevadera la experiencia.</p>
			<ul class="text-left italic ">
				<li>- Puedes Deshacer/Reformular el último dialogo.</li>
				<li>- Modificar las preferencias del contacto.</li>
				<li>- Tratar de ser especifico en tus consultas.</li>
			</ul>
			<br>
			<h1 class="text-left" style="font-size:25px">⚠️Advertencia</h1>
			<p class="text-left">El objetivo es divertirse pero siempre es bueno tener algunas consideraciones:</p>
			<ul class="text-left">
				<li>Esto no tiene fines de apoyo terapeutico ni emocionales.</li>
				<li><span style="color:red">Recuerda que simplemente estás hablando con un generador de texto, nada es real.</span></li>
			</ul>
			<br>
			<h1 class="text-left" style="font-size:25px">📚 Aspectos técnicos</h1>
			<p class="text-left">Esta aplicación se apoya en el modelo de Deep Learning GPT-3 creado por OpenAI, un modelo especializado en la generación de texto por medio de predicciónes de palabras en base a un contexto. Por lo tanto nada de lo que se genere ha sido programado, si no que ha sido producto de un modelo de Deep Learning. Se ha adaptado la entrada del modelo para que analice un esquema tipico conversacional, de esta manera emulando un dialogo.</p>
			<p class="text-left">Si bien GPT-3 fue entrenado en su mayoría con contenido en inglés, maneja muy bien el español con un gran grado de coherencia.</p>
			<br><p class="font-light text-left">**Los historiales de chats y configuraciones se guardan localmente en el navegador y nada de lo que escribas queda registrado en ninguna otra parte.</p>
			<br>Powered by:<a href="https://openai.com">OpenAI</a><br><br>
			<footer class="text-light">- Created by <a href="https://github.com/hwpoison/keep-talking">hwpoison</a> - 2021 -</footer>
		</div>
</div>
</template>
<script>
import NavBar from '../components/NavBar.vue'
export default {
	name:'Help',
	components:{
		NavBar
	}
}
</script>
<style scoped>
.fade-enter-active{
	opacity: 0;
	transition:  opacity 0.5s ease;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>