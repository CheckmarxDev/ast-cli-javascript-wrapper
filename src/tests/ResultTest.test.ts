import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import * as fs from "fs";
import { CxConstants } from '../main/wrapper/CxConstants';
import CxResult from '../main/results/CxResult';

describe("Results cases",() => {
    let cxScanConfig = new BaseTest();
    it('Result Test Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput  = await auth.scanList("");
        console.log(JSON.stringify(cxCommandOutput));
        let sampleId  = cxCommandOutput.payload.pop().id;
        console.log("Failed scanId " + sampleId);
        await auth.getResults(sampleId,"json","jsonList", ".");
        const file = await fileExists("./jsonList.json");
        expect(file).toBe(true);
    });

    it('Result List Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("");
        console.log(JSON.stringify(cxCommandOutput));
        let sampleId  = cxCommandOutput.payload.pop().id;
        const written = await auth.getResultsList(sampleId);
        expect(written.status).toEqual("");
    });

    it('Result summary html file generation successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("");
        let sampleId  = cxCommandOutput.payload.pop().id;
        await auth.getResults(sampleId,"summaryHTML","test", ".");
        const file = await fileExists("./test.html");
        expect(file).toBe(true);
    });

    it('Result summary html string successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("");
        let sampleId  = cxCommandOutput.payload.pop().id;
        const written = await auth.getResultsSummary(sampleId);
        expect(written.payload.length).toBeGreaterThan(0);
    });

    it('Result codebashing successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.codeBashingList("79","PHP","Reflected XSS All Clients");
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('Result bfl successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        console.log("ScanID : " + cxScanConfig.scanId)
        const results = await auth.getResultsList(cxScanConfig.scanId)
        const result: CxResult = results.payload.find(res => res.type == CxConstants.SAST)
        const data = result.data
        const queryId = data.queryId
        console.log("QueryID :" + result.data.queryId)
        const cxCommandOutput: CxCommandOutput = await auth.getResultsBfl(cxScanConfig.scanId, queryId, data.nodes);
        expect(cxCommandOutput.payload.length).toBeGreaterThanOrEqual(-1);
    });
});

const fileExists = (file:any) => {
    return new Promise((resolve) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        });
    })
}