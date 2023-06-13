import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";
import {BaseTest} from "./BaseTest";
import CxChat from "../main/chat/CxChat";

describe("Chat", () => {
    it('Try call', async () => {
        const config = new BaseTest();
        config.pathToExecutable = "path\\to\\cli\\dev\\build"
        const wrapper = new CxWrapper(config);
        let cxCommandOutput: CxCommandOutput = await wrapper.chat(
            "apikey",
            "path\\to\\result\\file",
            3,
            "MEDIUM",
            "Security Opt Not Set",
            "Explain the result",
            null,
            "gpt-3.5-turbo"
        );
        expect(cxCommandOutput.exitCode).toBe(0);
        const output: CxChat = cxCommandOutput.payload.pop();
        cxCommandOutput = await wrapper.chat(
            "apikey",
            "path\\to\\result\\file",
            3,
            "MEDIUM",
            "Security Opt Not Set",
            "Can you provide a snippet with the fix?",
            output.conversationId,
            "gpt-3.5-turbo"
        );
        expect(cxCommandOutput.exitCode).toBe(0);
    });
});