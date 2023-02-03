import {Simctl} from 'node-simctl';

export const getRuntimesAndSupportedDevices = async () => {
    const simctl = new Simctl();

    const devicesAndRuntimes = await simctl.list();

    return devicesAndRuntimes.runtimes.map(runtime => {
        return {
            runtimeName: runtime.name,
            supportedDeviceTypes: runtime.supportedDeviceTypes.map(supportedDeviceType => supportedDeviceType.name)
        }
    });
};
export const resetTMADevices = async () => {
    try {
        await fetch("http://127.0.0.1:8585/api/simulators/refresh", {
            method: 'POST'
        });
    } catch (e) {
        console.log('Tried to refresh tma devices but got an error', e);
    }
}
