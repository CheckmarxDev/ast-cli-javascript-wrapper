import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import * as fs from "fs";

describe("Results cases",() => {
    const cxScanConfig = new BaseTest();
    it('Result Test Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput  = await auth.scanList("statuses=Completed");
        const sampleId  = cxCommandOutput.payload.pop().id;
        
        auth.getResults(sampleId,"json","jsonList", ".").then(() => {
           fileExists("./jsonList.json").then(file => expect(file).toBe(true));
        });
    });

    it('Result Test With Agent Flug Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput  = await auth.scanList("statuses=Completed");
        const sampleId  = cxCommandOutput.payload.pop().id;
        
        auth.getResults(sampleId,"json","jsonList", ".", "jswrapper").then(() => {
           fileExists("./jsonList.json").then(file => expect(file).toBe(true));
        });
    });

    it('Result List Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const scanList: CxCommandOutput = await auth.scanList("statuses=Completed");
        let output;
        while (!output && scanList && scanList.payload && scanList.payload.length > 0) {
            const scanId = scanList.payload.pop().id;
            console.log("Triage Successful case -  ScanId " + scanId);
            output = await auth.getResultsList(scanId);
            if (output.status == "Error in the json file.") {
                output = undefined;
            }
        }
        expect(output.status).toBeUndefined();
        expect(output.payload.length).toBeGreaterThanOrEqual(0);
    });

    it('Result summary html file generation successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("statuses=Completed");
        const sampleId  = cxCommandOutput.payload.pop().id;
        await auth.getResults(sampleId,"summaryHTML","test", ".");
        const file = await fileExists("./test.html");
        expect(file).toBe(true);
    });

    it('Result summary html string successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanList("statuses=Completed");
        const sampleId  = cxCommandOutput.payload.pop().id;
        const written = await auth.getResultsSummary(sampleId);
        expect(written.payload.length).toBeGreaterThan(0);
    });

    it('Result codebashing successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.codeBashingList("79","PHP","Reflected XSS All Clients");
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    // The project ID is hardcoded because there is no dynamic way to associate 
  // an application with a project through the CLI.
  // link to the our application: https://deu.ast.checkmarx.net/applications/5dff8d1c-d27f-4910-afc1-0b9df02324b4/overview
  it("Risk Management - Successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const projectId = "a5d99fa4-973d-48b5-86c7-6401487e1d52"

    const cxCommandOutput: CxCommandOutput = await auth.riskManagementResults(
      projectId
    );

    const str = JSON.stringify(cxCommandOutput);
    console.log("Risk Management Result 1: " + str);
    console.log("Risk Management Exit code 1: " + cxCommandOutput.exitCode);
    console.log("Risk Management payload 1: " + cxCommandOutput.payload);

    expect(cxCommandOutput.exitCode).toBe(0);
    expect(Object.keys(cxCommandOutput.payload).length).toBeGreaterThan(0);
  });


   // The project ID is hardcoded because there is no dynamic way to associate 
  // an application with a project through the CLI.
  // link to the our application: https://deu.ast.checkmarx.net/applications/5dff8d1c-d27f-4910-afc1-0b9df02324b4/overview
  it("Risk Management - With Limit", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const projectId = "a5d99fa4-973d-48b5-86c7-6401487e1d52"
    const cxCommandOutput: CxCommandOutput = await auth.riskManagementResults(
      projectId,
      10
    );

    const str = JSON.stringify(cxCommandOutput);
    console.log("Risk Management Result 2: " + str);
    console.log("Risk Management Exit code 2: " + cxCommandOutput.exitCode);
    console.log("Risk Management payload 2: " + cxCommandOutput.payload);

    expect(cxCommandOutput.exitCode).toBe(0);
    expect(Object.keys(cxCommandOutput.payload).length).toBeGreaterThan(0);
  });

})



const fileExists = (file:string) => {
    return new Promise((resolve) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        });
    })
}