import {CxScanConfigCall} from '../main/CxScanConfigCall';
import {CxAuthCall} from '../main/CxAuthCall';
import {CxParamType} from '../main/CxParamType';
import 'babel-polyfill';
import {CxCommandOutput} from "../main/CxCommandOutput";

let cxScanConfig = new CxScanConfigCall();
cxScanConfig.baseUri = process.env["CX_BASE_URI"];
cxScanConfig.clientId = process.env["CX_CLIENT_ID"];
cxScanConfig.clientSecret = process.env["CX_CLIENT_SECRET"];
if(process.env["PATH_TO_EXECUTABLE"] !== null && process.env["PATH_TO_EXECUTABLE"] !== undefined ) {
    cxScanConfig.pathToExecutable = process.env["PATH_TO_EXECUTABLE"];
}
let params = new Map();
params.set(CxParamType.PROJECT_NAME, "JayJavascriptWrapperTest");
params.set(CxParamType.SCAN_TYPES, "sast");
//params.set(CxParamType.ADDITIONAL_PARAMETERS, "--nowait");

params.set(CxParamType.S, ".");
params.set(CxParamType.FILTER, "*.ts");
const auth = new CxAuthCall(cxScanConfig);

describe("ScanCreate cases",() => {
it('ScanCreate Successful case', async () => {
    const data = await auth.scanCreate(params);
    const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
    expect(cxCommandOutput.exitCode).toEqual(0);
})
});

describe("ScanCreate cases",() => {
    it('ScanCreate Failure case', async () => {
        params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default Jay");
        const data = await auth.scanCreate(params);
        const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data))
        expect(cxCommandOutput.exitCode).toEqual(1);
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