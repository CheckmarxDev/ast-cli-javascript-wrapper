import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";

describe("EngineAPIList cases",() => {
    const cxScanConfig = new BaseTest();
    it('EngineAPIList Successful case1', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.engineApiList("SAST");
        const cxCommandOutput: CxCommandOutput = data;
        console.log(cxCommandOutput)
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('EngineAPIList Successful case2', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.engineApiList("SCA");
        const cxCommandOutput: CxCommandOutput = data;
        console.log(cxCommandOutput)
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('EngineAPIList Successful case3', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.engineApiList("Iac");
        const cxCommandOutput: CxCommandOutput = data;
        console.log(cxCommandOutput)
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('EngineAPIList Successful case4', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.engineApiList("");
        const cxCommandOutput: CxCommandOutput = data;
        console.log(cxCommandOutput)
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('EngineAPIList Successful case5', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.engineApiList("xyz");
        const cxCommandOutput: CxCommandOutput = data;
        console.log(cxCommandOutput)
        expect(cxCommandOutput.exitCode).toBe(1);
    });

});