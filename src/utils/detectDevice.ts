export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const deviceType = (): DeviceType => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

const deviceTypeByViewport = (): DeviceType => {
    return window.matchMedia("(max-width: 1240px)").matches ? 'mobile' : 'desktop';
};

export { deviceType, deviceTypeByViewport };
