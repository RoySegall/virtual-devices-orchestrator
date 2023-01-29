import {Simctl} from 'node-simctl';
import express = require('express');

const app = express();
app.use(express.json());

const port = 3001

const getRuntimesAndSupportedDevices = async () => {
    const simctl = new Simctl();

    const devicesAndRuntimes = await simctl.list();

    return devicesAndRuntimes.runtimes.map(runtime => {
        return {
            runtimeName: runtime.name,
            supportedDeviceTypes: runtime.supportedDeviceTypes.map(supportedDeviceType => supportedDeviceType.name)
        }
    });
};

app.get('/runtimesAndDevices', async (req, res) => {
    const runtimesAndSupportedDevices = await getRuntimesAndSupportedDevices();
    res.json(runtimesAndSupportedDevices);
});

app.get('/devices', async (req, res) => {
    const simctl = new Simctl();

    const devicesAndRuntimes = await simctl.list();

    res.json(Object.values(devicesAndRuntimes.devices).flat().map(device => ({
        udid: device.udid,
        name: device.name,
        state: device.state,
        isAvailable: device.isAvailable
    })))
});

app.post('/device', async (req, res) => {
    const simctl = new Simctl();

    const {runtimeName, device, name, shouldStart} = req.body;

    if (!runtimeName || !device || !name) {
        return res.status(400).json({error: 'Missing runtimeName, device or name'})
    }

    simctl.udid = await simctl.createDevice(name, device, runtimeName);

    if (shouldStart) {
        await simctl.bootDevice();
        await simctl.startBootMonitor({timeout: 120000});
    }

    try {
        await fetch("http://127.0.0.1:8585/api/simulators/refresh", {
            method: 'POST'
        });
    } catch (e) {
        console.log(e)
    }
    res.json(simctl)
});

app.delete('/device/:udid', async (req, res) => {
    const simctl = new Simctl();
    simctl.udid = req.params.udid
    await simctl.deleteDevice();


    try {
        await fetch("http://127.0.0.1:8585/api/simulators/refresh", {
            method: 'POST'
        });
    } catch (e) {
        console.log(e)
    }

    res.json({status: 'deleted'})
});

app.listen(port, () => {
    console.log(`The TMA simulator exists in http://localhost:${port}`);
});
