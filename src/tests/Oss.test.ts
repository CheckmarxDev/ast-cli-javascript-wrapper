import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import {CxParamType} from "../main/wrapper/CxParamType";
import CxScan from "../main/scan/CxScan";

describe("ProjectList cases",() => {
    const cxScanConfig = new BaseTest();
 
    it('ScanAsca Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanOSS("tsc/tests/data/python-vul-file.py");
        console.log("Json object from scanOSS successful case: " + JSON.stringify(cxCommandOutput));
        const scanObject = cxCommandOutput.payload.pop();
        expect(cxCommandOutput.payload).toBeDefined();
        expect(cxCommandOutput.exitCode).toBe(0);
    });
});