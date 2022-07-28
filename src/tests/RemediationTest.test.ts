import {CxWrapper} from '../main/wrapper/CxWrapper';
import {BaseTest} from "./BaseTest";
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import CxKicsRemediation from "../main/remediation/CxKicsRemediation";

describe("Kics Remediation cases",() => {
    const cxScanConfig = new BaseTest();
    it('Kics Remediation Successful case', async () => {
        const auth = new CxWrapper(cxScanConfig);
        auth.kicsRemediation("dist/tests/data/results.json",__dirname+"/dist/tests/data/","",).then((e:[Promise<CxCommandOutput>,any]) => {
            e[0].then((output:CxCommandOutput)=>{
                expect(output).toBeDefined();
            })
        });
    });

    it('Kics Remediation Successful case with filter', async () => {
        const auth = new CxWrapper(cxScanConfig);
        auth.kicsRemediation("/Users/ricardobatista/Desktop/ast-cli/results.json",__dirname+"/dist/tests/data/","","9574288c118e8c87eea31b6f0b011295a39ec5e70d83fb70e839b8db4a99eba8").then((e:[Promise<CxCommandOutput>,any]) => {
            e[0].then((output)=>{
                const remediation: CxKicsRemediation = output.payload[0]
                expect(remediation.availableRemediation).toBeDefined();
                expect(remediation.appliedRemediation).toBeDefined();
            })
        });
    });
});