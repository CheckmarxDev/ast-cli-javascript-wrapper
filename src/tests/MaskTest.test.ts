import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import CxWrapperFactory from "../main/wrapper/CxWrapperFactory";

const cxWrapperFactory = new CxWrapperFactory();

describe("Mask cases",() => {
    const cxScanConfig = new BaseTest();
    it('Mask Successful case', async () => {
        const auth = await cxWrapperFactory.createWrapper(cxScanConfig);
        const data = await auth.maskSecrets("dist/tests/data/package.json")
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.payload.length).toEqual(1);
    });

});