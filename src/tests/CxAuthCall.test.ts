import {CxScanConfig} from '../main/CxScanConfig';
import {CxAuth} from '../main/CxAuth';
import {CxParamType} from '../main/CxParamType';
import 'babel-polyfill';
import {CxCommandOutput} from "../main/CxCommandOutput";

let cxScanConfig = new CxScanConfig();
cxScanConfig.baseUri = process.env["CX_BASE_URI"];
cxScanConfig.clientId = process.env["CX_CLIENT_ID"];
cxScanConfig.clientSecret = process.env["CX_CLIENT_SECRET"];
if(process.env["PATH_TO_EXECUTABLE"] !== null && process.env["PATH_TO_EXECUTABLE"] !== undefined ) {
    cxScanConfig.pathToExecutable = process.env["PATH_TO_EXECUTABLE"];
}
let params = new Map();
params.set(CxParamType.PROJECT_NAME, "ASTJavascriptWrapperTest");
params.set(CxParamType.SCAN_TYPES, "sast");

params.set(CxParamType.S, ".");
params.set(CxParamType.FILTER, "*.ts");
const auth = new CxAuth(cxScanConfig);

describe("ScanCreate cases",() => {
    it('ScanCreate Successful case wait mode', async () => {
    const data = await auth.scanCreate(params);
    const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        if(cxCommandOutput.scanObjectList.length !== 0) {
            const scanID = cxCommandOutput.scanObjectList.pop().ID
            const scanObject = await auth.scanShow(scanID);
            const status = scanObject.scanObjectList.pop().Status
            expect(status).toMatch(/(Complete|Running|Queued)/i)
        }
        else {
            expect(cxCommandOutput.exitCode).toEqual(0)
        }
})
    it('ScanCreate Successful case no wait mode', async () => {
        params.set(CxParamType.ADDITIONAL_PARAMETERS, "--nowait");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        if(cxCommandOutput.scanObjectList.length !== 0) {
            const scanID = cxCommandOutput.scanObjectList.pop().ID
            const scanObject = await auth.scanShow(scanID);
            const status = scanObject.scanObjectList.pop().Status
            expect(status).toMatch(/(Complete|Running|Queued)/i)
        }
        else {
            expect(cxCommandOutput.exitCode).toEqual(0)
        }
    })

    it('ScanCreate Successful case with Branch', async () => {
        params.set(CxParamType.BRANCH, "main");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        if(cxCommandOutput.scanObjectList.length !== 0) {
            const scanID = cxCommandOutput.scanObjectList.pop().ID
            const scanObject = await auth.scanShow(scanID);
            const status = scanObject.scanObjectList.pop().Status
            //expect(status).toContain("Completed" || "Running" || "Queued")
            expect(status).toMatch(/(Complete|Running|Queued)/i)
        }
        else {
            expect(cxCommandOutput.exitCode).toEqual(0)
        }
        // expect(await auth.scanShow(cxCommandOutput.scanObjectList.pop().ID).then(data => {
        //     return JSON.stringify(data.scanObjectList.pop().Status)
        // })).toContain("Completed" || "Running" || "Queued");
    })

});

describe("ScanCreate cases",() => {
    it('ScanCreate Failure case', async () => {
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Jay");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        if(cxCommandOutput.scanObjectList.length !== 0) {
            const scanID = cxCommandOutput.scanObjectList.pop().ID
            const scanObject = await auth.scanShow(scanID);
            const status = scanObject.scanObjectList.pop().Status
            //expect(status).toContain("Failed" || "Running" || "Queued")
            expect(status).toMatch(/(Failed|Running|Queued)/i)
        }
        else {
            expect(cxCommandOutput.exitCode).toEqual(1)
        }
    })
});

describe("ScanList cases",() => {
    it('ScanList Successful case', async () => {
        const data = await auth.scanList();
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        expect(cxCommandOutput.scanObjectList.length).toBeGreaterThan(0);
    });
});

describe("ProjectList cases",() => {
    it('ProjectList Successful case', async () => {
        const data = await auth.projectList();
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        expect(cxCommandOutput.scanObjectList.length).toBeGreaterThan(0);
    });
});