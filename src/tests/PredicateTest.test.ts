import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import CxResult from '../main/results/CxResult';
import {CxConstants} from '../main/wrapper/CxConstants';

describe("Triage cases", () => {
    const cxScanConfig = new BaseTest();

    it('TriageShow Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);

        const scanList: CxCommandOutput = await auth.scanList("statuses=Completed");
        const scan = scanList.payload.pop();

        const results = await auth.getResultsList(scan.id)
        const result: CxResult = results.payload.find(res => res.type == CxConstants.SAST)

        const cxShow: CxCommandOutput = await auth.triageShow(scan.projectID, result.similarityId, result.type);

        expect(cxShow.exitCode).toEqual(0);

        const cxUpdate: CxCommandOutput = await
            auth.triageUpdate(scan.projectID, result.similarityId, result.type, result.state,
                "Edited via JavascriptWrapper",
                result.severity.toLowerCase() == "high" ? CxConstants.SEVERITY_MEDIUM : CxConstants.SEVERITY_HIGH);

        expect(cxUpdate.exitCode).toEqual(0);
    });
});