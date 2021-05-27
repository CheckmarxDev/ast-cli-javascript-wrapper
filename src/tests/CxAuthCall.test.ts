import {CxScanConfigCall} from '../main/CxScanConfigCall';
import {CxAuthCall} from '../main/CxAuthCall';
import {CxParamType} from '../main/CxParamType';
import CxScan from "../main/CxScan";
import 'babel-polyfill';

let cxScanConfig = new CxScanConfigCall();
cxScanConfig.baseUri = "https://eu.ast.checkmarx.net";
cxScanConfig.clientId = "ast-github-action";
cxScanConfig.clientSecret = "1985057d-7479-4a01-82c0-06d0edc41228";
let params = new Map();
params.set(CxParamType.PROJECT_NAME,"JayJavascriptWrapperTest");
params.set(CxParamType.SCAN_TYPES,"sast");
params.set(CxParamType.ADDITIONAL_PARAMETERS,"--nowait");
params.set(CxParamType.SAST_PRESET_NAME,"Checkmarx Default");
params.set(CxParamType.S,".");
const auth = new CxAuthCall(cxScanConfig);

test('ScanCreate Successful case', async () => {
        const data = await auth.scanCreate(params);
        const cxScanObject: CxScan = JSON.parse(data);
        expect(cxScanObject.Status).toContain("Queued");
});

test('ScanList Successful case', async () => {
        const data = await auth.scanList();
        const cxScanObject: CxScan[] = JSON.parse(data);
        expect(cxScanObject.length).toBeGreaterThan(0);
});