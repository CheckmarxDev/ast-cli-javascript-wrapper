import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import {CxParamType} from "../main/wrapper/CxParamType";
import CxScan from "../main/scan/CxScan";

describe("ProjectList cases",() => {
    const cxScanConfig = new BaseTest();
    it('ProjectList Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        const data = await auth.projectList("");
        const cxCommandOutput: CxCommandOutput = data;
        expect(cxCommandOutput.payload.length).toBeGreaterThan(0);
    });

    it('ProjectShow Successful case', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scan: CxScan = cxCommandOutput.payload.pop();

        const cxProjectCommandOutput: CxCommandOutput = await auth.projectShow(scan.projectID);;
        const size = cxProjectCommandOutput.payload.length;
        expect(size).toBeGreaterThan(0);
    });

    it('ProjectBranches Successful case', async () => {
        const params = new Map();
        params.set(CxParamType.PROJECT_NAME, "ast-cli-javascript-integration-success");
        params.set(CxParamType.S, "./src");
        params.set(CxParamType.FILTER, "*.ts,!**/node_modules/**/*");
        params.set(CxParamType.BRANCH, "master");
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await auth.scanCreate(params);
        const scan: CxScan = cxCommandOutput.payload.pop();

        const cxBranchCommandOutput: CxCommandOutput = await auth.projectBranches(scan.projectID,"");
        expect(cxBranchCommandOutput.payload.length).toBeGreaterThan(0);
    });
});