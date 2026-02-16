<template>
<div id="help-view" class="absolute inset-0 flex flex-col">
	<NavBar :showBackButton=true>
		<template #navbar-title>
			<p class="text-2xl font-light justify-self-start mt-6 ml-2"> {{ text.about }}<span style="padding-left:1px; font-size:9px" class="absolute" >v1.2</span></p>
		</template>
	</NavBar>
		<div class="flex-1 px-2 p-4 overflow-y-scroll">
			<h1 class="text-left" style="font-size:25px"></h1>
			<p class="text-left text-xl">{{ text.helpDescription }}</p>
			<br>
			<h1 class="text-left" style="font-size:25px">{{ text.helpLimitations }}</h1>
			<p class="text-left">{{ text.helpLimitationsDescription }}</p>
			<ul class="text-left italic ">
				<li>- {{ text.helpUndo }}</li>
				<li>- {{ text.helpModify }}</li>
				<li>- {{ text.helpSpecific }}</li>
			</ul>
			<br>
			<h1 class="text-left" style="font-size:25px">{{ text.helpWarning }}</h1>
			<p class="text-left">{{ text.helpWarningDescription }}</p>
			<ul class="text-left">
				<li>{{ text.helpNotTherapy }}</li>
				<li><span style="color:red">{{ text.helpNotReal }}</span></li>
			</ul>
			<br>
			<h1 class="text-left" style="font-size:25px">{{ text.helpTechnical }}</h1>
			<p class="text-left">{{ text.helpTechnicalDescription }}</p>
			<p class="text-left">{{ text.helpTechnicalDescription2 }}</p>
			<br><p class="font-light text-left">{{ text.helpLocalStoreNote }}</p>
			<br>{{ text.poweredBy }}:<a href="https://openai.com">OpenAI</a><br><br>
			<footer class="text-light">- {{ text.helpCreatedBy }} <a href="https://github.com/hwpoison/keep-talking">hwpoison</a> - 2022 -</footer>
		</div>
</div>
</template>
<script>
import NavBar from '../components/NavBar.vue'
import { text } from '../services/language'

export default {
	name:'Help',
	components:{
		NavBar
	},
	setup(){
		return {
			text
		}
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