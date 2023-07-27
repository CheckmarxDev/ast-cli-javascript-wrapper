import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";

describe("Mask cases",() => {
    const cxScanConfig = new BaseTest();
    it('Mask Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.maskSecrets("dist/tests/data/package.json")
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.payload.length).toEqual(1);
    });

});