import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import {CxParamType} from "../main/wrapper/CxParamType";

describe("ProjectList cases",() => {
    const cxScanConfig = new BaseTest();
    it('ProjectList Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.projectList("");
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('ProjectShow Successful case',async () =>{
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        let auth = new CxWrapper(cxScanConfig);
        let data = await auth.scanCreate(params);
        let cxCommandOutput: CxCommandOutput = data;
        let ScanObject = cxCommandOutput.payload.pop();
        cxCommandOutput = await auth.projectShow(ScanObject.ProjectID);
        console.log(" Json object from ProjectShow Successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('ProjectBranches Successful case',async () =>{
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        let auth = new CxWrapper(cxScanConfig);
        let data = await auth.scanCreate(params);
        let cxCommandOutput: CxCommandOutput = data;
        let ScanObject = cxCommandOutput.payload.pop();
        cxCommandOutput = await auth.projectBranches(ScanObject.ProjectID,"");
        console.log("Json object from projectBranches Successful case: " + JSON.stringify(cxCommandOutput))
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });
});