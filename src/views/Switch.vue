<script>
// Switch between Mobile and Desktop View
import { h, resolveComponent } from "vue"
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
		return () => {
			if (window.matchMedia("(max-width: 675px)").matches) {
				return h(MobileLayout)
			} else {
				return h(DesktopLayout)
			}
		}
	},
}
</script>
