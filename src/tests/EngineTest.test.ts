import { CxWrapper } from '../main/wrapper/CxWrapper';
import { CxCommandOutput } from "../main/wrapper/CxCommandOutput";
import { BaseTest } from "./BaseTest";

describe("EngineListAPI cases", () => {
    const cxEngineConfig = new BaseTest();
    it('EngineListAPI Successful case', async () => {
        const auth = new CxWrapper(cxEngineConfig);
        const cxCommandOutput: CxCommandOutput = await auth.enginesApiList();
        console.log(" Json object from engineAPIList successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.payload.length).toBeGreaterThan(1);
        expect(cxCommandOutput.exitCode).toBe(0);
    });

    it('EngineListAPI Successful case with engine name sast', async () => {
        const auth = new CxWrapper(cxEngineConfig);
        const engineName = 'sast';
        const cxCommandOutput: CxCommandOutput = await auth.enginesApiList(engineName);
        console.log(" Json object from engineAPIList successful case with enginename sast: " + JSON.stringify(cxCommandOutput));

        expect(cxCommandOutput.payload[0].EngineName.toLowerCase()).toBe(engineName);
        expect(cxCommandOutput.exitCode).toBe(0);
    })

    it('EngineListAPI Successful case with engine name sca', async () => {
        const auth = new CxWrapper(cxEngineConfig);
        const engineName = 'sca';
        const cxCommandOutput: CxCommandOutput = await auth.enginesApiList(engineName);
        console.log(" Json object from engineAPIList successful case with enginename sast: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.payload[0].EngineName.toLowerCase()).toBe(engineName);
        expect(cxCommandOutput.exitCode).toBe(0);
    })

    it('EngineListAPI Failure case', async () => {
        const auth = new CxWrapper(cxEngineConfig);
        const engineName = 'fakeengine';
        const cxCommandOutput: CxCommandOutput = await auth.enginesApiList(engineName);
        console.log(" Json object from failure case: " + JSON.stringify(cxCommandOutput));
        console.log(" cxCommandOutput: " + cxCommandOutput);

        expect(cxCommandOutput.payload.length).toBeLessThanOrEqual(0);
    })
});
