import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {CxScanConfig} from "../main/scan/CxScanConfig";
import {BaseTest} from "./BaseTest";


describe("Authentication validation",() => {
    let cxScanConfig = new BaseTest();
    it('Result authentication successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.authValidate();
        const cxCommandOutput: CxCommandOutput = data
        expect(cxCommandOutput.exitCode).toBe(0);
    });
    it('Result authentication failed case', async () => {
        let cxScanConfig_fail = new CxScanConfig();
        cxScanConfig_fail.baseUri = "error";
        cxScanConfig_fail.clientId = "error";
        cxScanConfig_fail.clientSecret = "error";
        cxScanConfig_fail.tenant = process.env["CX_TENANT"];
        cxScanConfig_fail.apiKey = "error";

        const auth = new CxWrapper(cxScanConfig_fail);
        const data = await auth.authValidate();
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.exitCode).toBe(1);
    });
});