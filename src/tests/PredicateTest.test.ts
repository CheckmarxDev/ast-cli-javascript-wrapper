import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import CxResult from '../main/results/CxResult';
import { CxConstants } from '../main/wrapper/CxConstants';

describe("Triage cases",() => {
    let cxScanConfig = new BaseTest();

    it('TriageShow Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const scan = (await auth.scanShow(cxScanConfig.scanId)).payload.pop();
        const results = await auth.getResultsList(cxScanConfig.scanId)
        const result: CxResult = results.payload.find(res => res.type == CxConstants.SAST)

        const cxCommandOutput: CxCommandOutput = await auth.triageShow(scan.projectID, result.similarityId, result.type);
        
        expect(cxCommandOutput.exitCode).toEqual(0);
    })

    it('TriageUpdate Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const scan = (await auth.scanShow(cxScanConfig.scanId)).payload.pop();
        const results = await auth.getResultsList(cxScanConfig.scanId)
        const result: CxResult = results.payload.find(res => res.type == CxConstants.SAST)

        const cxCommandOutput: CxCommandOutput = await auth.triageUpdate(scan.projectID, result.similarityId, result.type, CxConstants.STATE_CONFIRMED, "Edited via JavascriptWrapper", result.severity.toLowerCase() == "high" ? CxConstants.SEVERITY_MEDIUM : CxConstants.SEVERITY_HIGH);

        expect(cxCommandOutput.exitCode).toEqual(0);
    })
});