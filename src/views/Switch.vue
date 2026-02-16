<script>
// Switch between Mobile and Desktop View
import { h, resolveComponent, watch } from "vue"
import { useRouter } from "vue-router"
import { viewport } from '../services/viewport'
import { navigation } from '../services/navigation'

import Contacts from "../views/Contacts.vue"
import DesktopLayout from "../layouts/DesktopLayout.vue"

export default {
	components: {
		Contacts,
		DesktopLayout,
	},
	// eslint-disable-next-line
	setup() {
		const MobileLayout = resolveComponent("Contacts")
		const router = useRouter()

		watch(viewport.type, (newDevice) => {
			console.log(`[Switch] Viewport changed to: ${newDevice}`);
			if (newDevice === 'mobile' && navigation.activeContactId.value) {
				console.log(`[Switch] Redirecting to mobile chat: ${navigation.activeContactId.value}`);
				router.replace(`/chat/${navigation.activeContactId.value}`)
			}
		})

		return () => {
			if (viewport.type.value == 'mobile') {
				return h(MobileLayout)
			} else {
				return h(DesktopLayout)
			}
		}
	},
}
</script>
