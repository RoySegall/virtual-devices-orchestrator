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
