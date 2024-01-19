import {CxWrapper} from '../main/wrapper/CxWrapper';
// import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
// import CxChat from "../main/chat/CxChat";
//import {anything, instance, mock, when} from 'ts-mockito';
import {BaseTest} from "./BaseTest";

// function createOutput(exitCode:number,payload:CxChat):CxCommandOutput {
//     const output = new CxCommandOutput();
//     output.exitCode=exitCode;
//     output.status="";
//     output.payload=[payload];
//     return output;
// }

describe("Gpt Chat Cases", () => {
    // tests preparation
    // const cxScanConfig = new BaseTest();
    // const mockedWrapper: CxWrapper = mock(CxWrapper);
    // const originalWrapper: CxWrapper = new CxWrapper(cxScanConfig);
    // const outputSuccessful = createOutput(0,new CxChat("CONVERSATION",["RESPONSE"] ));
    //
    // when(mockedWrapper.chat("APIKEY","FILE",anything(),anything(),anything(),anything(),anything(), anything())).thenResolve(
    //     outputSuccessful
    // );
    // const wrapper: CxWrapper = instance(mockedWrapper);
    //
    // it('Gpt Chat Successful case', async () => {
    //     const cxCommandOutput = await wrapper.chat(
    //         "APIKEY",
    //         "FILE",
    //         0,
    //         "SEVERITY",
    //         "VULNERABILITY",
    //         "INPUT",
    //         "CONVERSATION",
    //         "MODEL"
    //     );
    //     expect(cxCommandOutput.exitCode).toBe(0);
    // });
    //
    // it('Gpt Chat Failed case', async () => {
    //     const cxCommandOutput = await originalWrapper.chat(
    //         "APIKEY",
    //         "FILE",
    //         0,
    //         "SEVERITY",
    //         "VULNERABILITY",
    //         "INPUT",
    //         "",
    //         "MODEL"
    //     );
    //     expect(cxCommandOutput.exitCode).toBe(0);
    //     expect(cxCommandOutput.payload[0].responses[0]).toBe("It seems that FILE is not available for AI Guided Remediation. Please ensure that you have opened the correct workspace or the relevant file.");
    // });

    it('Gpt SAST chat Successful case', async () => {
        const cxScanConfig = new BaseTest();
        const auth = new CxWrapper(cxScanConfig);
        const cxCommandOutput = await auth.sastChat(
            "gpt_token",
            "/Users/ricardobatista/Downloads",
            "/Users/ricardobatista/Desktop/git_repos/ast-vscode-extension/out/utils/ast-results.json",
            "13915401",
            "",
        );
        expect(cxCommandOutput.exitCode).toBe(0);
    });
});