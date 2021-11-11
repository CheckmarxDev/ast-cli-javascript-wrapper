import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {CxParamType} from "../main/wrapper/CxParamType";
import {BaseTest} from "./BaseTest";

describe("ScanCreate cases",() => {
    let cxScanConfig = new BaseTest();

    it('ScanList Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("");
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('ScanCreate Successful case wait mode', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.ID);
        console.log(" Json object from successful wait mode case: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().Status).toEqual("Completed");
    })

    it('ScanCreate Successful case with Branch', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success-branch");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.ID);
        console.log(" Json object from successful wait mode case with branch: " +JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().Status).toEqual("Completed");

    })

    it('ScanCreate Failure case', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-failure");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Fake");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scanObject = cxCommandOutput.payload.pop();
        const scanShowObject = await auth.scanShow(scanObject.ID);
        console.log(" Json object from failure case: " + JSON.stringify(scanShowObject));
        expect(scanShowObject.payload.pop().Status).toEqual("Failed");
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
        const scanShowObject = await auth.scanShow(scanObject.ID);
        console.log(" Json object from successful no wait mode case: " + JSON.stringify(scanShowObject))
        expect(scanShowObject.payload.pop().Status).toEqual("Running")
    })
});