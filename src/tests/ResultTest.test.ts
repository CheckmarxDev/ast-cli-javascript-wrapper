import { CxWrapper } from "../main/wrapper/CxWrapper";
import { CxCommandOutput } from "../main/wrapper/CxCommandOutput";
import { BaseTest } from "./BaseTest";
import * as fs from "fs";

describe("Results cases", () => {
  const cxScanConfig = new BaseTest();
  it("Result Test Successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const cxCommandOutput: CxCommandOutput = await auth.scanList(
      "statuses=Completed"
    );
    const sampleId = cxCommandOutput.payload.pop().id;

    auth.getResults(sampleId, "json", "jsonList", ".").then(() => {
      fileExists("./jsonList.json").then((file) => expect(file).toBe(true));
    });
  });

  it("Result Test With Agent Flug Successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const cxCommandOutput: CxCommandOutput = await auth.scanList(
      "statuses=Completed"
    );
    const sampleId = cxCommandOutput.payload.pop().id;

    auth.getResults(sampleId, "json", "jsonList", ".", "jswrapper").then(() => {
      fileExists("./jsonList.json").then((file) => expect(file).toBe(true));
    });
  });

  it("Result List Successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const scanList: CxCommandOutput = await auth.scanList("statuses=Completed");
    let output;
    while (
      !output &&
      scanList &&
      scanList.payload &&
      scanList.payload.length > 0
    ) {
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

  it("Result summary html file generation successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const cxCommandOutput: CxCommandOutput = await auth.scanList(
      "statuses=Completed"
    );
    const sampleId = cxCommandOutput.payload.pop().id;
    await auth.getResults(sampleId, "summaryHTML", "test", ".");
    const file = await fileExists("./test.html");
    expect(file).toBe(true);
  });

  it("Result summary html string successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const cxCommandOutput: CxCommandOutput = await auth.scanList(
      "statuses=Completed"
    );
    const sampleId = cxCommandOutput.payload.pop().id;
    const written = await auth.getResultsSummary(sampleId);
    expect(written.payload.length).toBeGreaterThan(0);
  });

  it("Result codebashing successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const cxCommandOutput: CxCommandOutput = await auth.codeBashingList(
      "79",
      "PHP",
      "Reflected XSS All Clients"
    );
    expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
  });

  it("Risk Management - Successful case", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const projectId = await getProjectId(auth);

    const cxCommandOutput: CxCommandOutput = await auth.riskManagementResults(
      projectId
    );
    console.log("Risk Management Results: " + JSON.stringify(cxCommandOutput));

    expect(cxCommandOutput.exitCode).toBe(0);
    expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
  });

  it("Risk Management - With Limit", async () => {
    const auth = new CxWrapper(cxScanConfig);
    const projectId = await getProjectId(auth);
    const cxCommandOutput: CxCommandOutput = await auth.riskManagementResults(
      projectId,
      10
    );
    console.log(
      "Risk Management Results with limit 10: " +
        JSON.stringify(cxCommandOutput)
    );

    expect(cxCommandOutput.exitCode).toBe(0);
    expect(cxCommandOutput.payload.length).toBeLessThanOrEqual(10);
  });
});

const getProjectId = async (auth: CxWrapper): Promise<string> => {
    const scanList: CxCommandOutput = await auth.scanList("statuses=Completed");
    if (!scanList.payload.length) {
        throw new Error("No completed scans found.");
    }
    const scan = scanList.payload.find((scan) => scan.projectID);
    if (!scan) {
        throw new Error("No valid projectId found.");
    }
    return scan.projectID;
};


const fileExists = (file: string) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true);
    });
  });
};
