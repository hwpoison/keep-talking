import { ref, onMounted, onUnmounted } from 'vue';
import { deviceTypeByViewport, DeviceType } from '../utils/detectDevice';

class Viewport {
    type = ref<DeviceType>(deviceTypeByViewport());

    init() {
        const update = () => {
            this.type.value = deviceTypeByViewport();
        };
        window.addEventListener('resize', update);
        update();
    }
}

export const viewport = new Viewport();
viewport.init();
export default viewport;
