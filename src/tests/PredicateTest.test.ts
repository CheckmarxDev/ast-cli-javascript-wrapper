import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import CxResult from '../main/results/CxResult';
import {CxConstants} from '../main/wrapper/CxConstants';

describe("Triage cases", () => {
    const cxScanConfig = new BaseTest();
    const auth = new CxWrapper(cxScanConfig);
    const getScanAndResult = async (): Promise<{ scan: any, result: CxResult }> => {
        const scanList: CxCommandOutput = await auth.scanList("statuses=Completed,limit=100");
        let scan, output, result;
        while (!output && scanList?.payload?.length > 0) {
            scan = scanList.payload.pop();
            console.log("Triage case - ScanId " + scan.id);
            output = await auth.getResultsList(scan.id);
            if (output.status === "Error in the json file.") {
                output = undefined;
            } else {
                result = output.payload.find(res => res.type === CxConstants.SAST);
                if (!result?.similarityId) {
                    output = undefined;
                }
            }
        }
        return { scan, result };
    };

    const handleTriageShow = async (scan: any, result: CxResult) => {
        const cxShow: CxCommandOutput = await auth.triageShow(scan.projectID, result.similarityId, result.type);
        expect(cxShow.exitCode).toEqual(0);
    }

    const handleTriageUpdate = async (scan: any, result: CxResult, newState: string, newSeverity: string, newStateId = -1) => {
        const cxUpdate: CxCommandOutput = await auth.triageUpdate(
            scan.projectID, result.similarityId, result.type, newState,
            "Edited via JavascriptWrapper",
            newSeverity, newStateId
        );
        expect(cxUpdate.exitCode).toEqual(0);
    };
    const handlegetStates = async () => {
        const cxCommandOutput: CxCommandOutput = await auth.triageGetStates(false);
        console.log("Json object from states successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.payload.length).toBeGreaterThanOrEqual(1);
        expect(cxCommandOutput.exitCode).toBe(0);
        return cxCommandOutput
    };

    it('Triage Successful case', async () => {
        const { scan, result } = await getScanAndResult();
        await handleTriageShow(scan, result);
        await handleTriageUpdate(scan, result, result.state, result.severity.toLowerCase() === "high" ? CxConstants.SEVERITY_MEDIUM : CxConstants.SEVERITY_HIGH);
    });

    it.skip('Triage with custom state Successful case', async () => {
        const { scan, result } = await getScanAndResult();

        const cxCommandOutput = await handlegetStates();

        let customState = cxCommandOutput.payload[0].name

        if (result.state == customState) {
            if (cxCommandOutput.payload.length > 1) {
                customState = cxCommandOutput.payload[1].name
            } else {
                await handleTriageUpdate(scan, result, CxConstants.STATE_CONFIRMED, CxConstants.SEVERITY_MEDIUM);
            }
        }
        await handleTriageUpdate(scan, result, customState, CxConstants.SEVERITY_MEDIUM);

    });

    it.skip('Triage with custom state id Successful case', async () => {
        const { scan, result } = await getScanAndResult();

        const cxCommandOutput = await handlegetStates();

        const allStates = cxCommandOutput.payload;
        let customStateId = allStates[0].id
        const customStateName = allStates[0].name

        if (result.state == customStateName) {
            if (allStates.length > 1) {
                customStateId = allStates[1].id
            } else {
                await handleTriageUpdate(scan, result, CxConstants.STATE_CONFIRMED, CxConstants.SEVERITY_MEDIUM);
            }
        }
        await handleTriageUpdate(scan, result, "", CxConstants.SEVERITY_MEDIUM, customStateId);
    });
});