import { CxWrapper } from '../main/wrapper/CxWrapper';
import { CxCommandOutput } from "../main/wrapper/CxCommandOutput";
import { CxParamType } from "../main/wrapper/CxParamType";
import { BaseTest } from "./BaseTest";

describe("ScanCreate cases", () => {
    const cxScanConfig = new BaseTest();
    it('ScanList Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("");
        console.log(" Json object from scanList successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.payload.length).toBeGreaterThan(1);
        expect(cxCommandOutput.exitCode).toBe(0);
    });

    it('ScanCreate Successful case wait mode', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        params.set(CxParamType.SCAN_TYPES,"kics");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.id);
        console.log(" Json object from successful wait mode case: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().status).toEqual("Completed");
    })

    it('ScanCreate Failure case', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-failure");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Fake");
        params.set(CxParamType.BRANCH, "master");
        params.set(CxParamType.SCAN_TYPES, "sast");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.id);
        console.log(" Json object from failure case: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().status).toEqual("Failed");
    })

    it('ScanCreate Successful case with Branch', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success-branch");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, "--scan-types sast");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.id);
        console.log(" Json object from successful wait mode case with branch: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().status).toEqual("Completed");

    })

    it('ScanCreate Successful case no wait mode', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-nowait");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Fake");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, "--async");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.id);
        console.log(" Json object from successful no wait mode case: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().status).toEqual("Running");
    })

    it('ScanCancel Successful case', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-cancel");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.BRANCH, "master");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, "--async");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        await auth.scanCancel(scanObject.id)
        const scanShowObject = await auth.scanShow(scanObject.id);
        expect(scanShowObject.exitCode).toEqual(0);
    })

    it('KicsRealtime Successful case ', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const [outputProcess,pid] = await auth.kicsRealtimeScan("dist/tests/data/Dockerfile","docker","-v");
        const cxCommandOutput: CxCommandOutput = await outputProcess;
        console.log(" Json object from successful no wait mode case: " + JSON.stringify( cxCommandOutput.payload));
        const scanObject = cxCommandOutput.payload.pop();
        console.log(" Json object from successful no wait mode case: " + JSON.stringify(scanObject));
        expect(scanObject.results.length).toBeGreaterThan(0);
        expect(pid).toBeDefined();
    })

    it('ScaRealtime Successful case', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await wrapper.runScaRealtimeScan(process.cwd());
        if(cxCommandOutput.exitCode == 1) {
            expect(cxCommandOutput.payload).toBeUndefined();
        } else {
            const scanObject = cxCommandOutput.payload.pop();
            expect(scanObject.results).toBeDefined();
        }
    })

    it("Should check if scan create is possible", async() => {
        const auth = new CxWrapper(cxScanConfig);
        const tenantSettings: boolean = await auth.ideScansEnabled();
        expect(tenantSettings).toBeDefined();
    })
});