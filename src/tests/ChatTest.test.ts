import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import CxChat from "../main/chat/CxChat";
import {anything, instance, mock, when} from 'ts-mockito';
import {BaseTest} from "./BaseTest";

function createOutput(exitCode:number,payload:CxChat):CxCommandOutput {
    const output = new CxCommandOutput();
    output.exitCode=exitCode;
    output.status="";
    output.payload=[payload];
    return output;
}

describe("Gpt Chat Cases", () => {
    // tests preparation
    const cxScanConfig = new BaseTest();
    const mockedWrapper: CxWrapper = mock(CxWrapper);
    const originalWrapper: CxWrapper = new CxWrapper(cxScanConfig);
    const outputSuccessful = createOutput(0,new CxChat("CONVERSATION",["RESPONSE"] ));

    when(mockedWrapper.chat("APIKEY","FILE",anything(),anything(),anything(),anything(),anything(), anything())).thenResolve(
        outputSuccessful
    );
    const wrapper: CxWrapper = instance(mockedWrapper);

    it('Gpt Chat Successful case', async () => {
        const cxCommandOutput = await wrapper.chat(
            "APIKEY",
            "FILE",
            0,
            "SEVERITY",
            "VULNERABILITY",
            "INPUT",
            "CONVERSATION",
            "MODEL"
        );
        expect(cxCommandOutput.exitCode).toBe(0);
    });

    it('Gpt Chat Failed case', async () => {
        const cxCommandOutput = await originalWrapper.chat(
            "APIKEY",
            "",
            0,
            "SEVERITY",
            "VULNERABILITY",
            "INPUT",
            "CONVERSATION",
            "MODEL"
        );
        expect(cxCommandOutput.exitCode).toBe(1);
        expect(cxCommandOutput.status).toBe("open : no such file or directory\n");
    });
});