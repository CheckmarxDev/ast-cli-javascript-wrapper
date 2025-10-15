import {BaseTest} from "./BaseTest";
import {CxWrapper} from "../main/wrapper/CxWrapper";
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";

describe("LearnMoreDescriptions cases",() => {
    const cxScanConfig = new BaseTest();
    it('LearnMoreDescriptions Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const queryId = process.env.CX_TEST_QUERY_ID;
        const data = await auth.learnMore(queryId !== undefined? queryId : "16772998409937314312")
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    })
    
    it('LearnMoreDescriptions Failure case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const queryId = "";
        const data = await auth.learnMore(queryId !== undefined? queryId : "")
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.status).toBe("Value of query-id is invalid\n");
    })
})
