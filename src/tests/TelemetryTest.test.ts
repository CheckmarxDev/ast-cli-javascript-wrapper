import { CxWrapper } from '../main/wrapper/CxWrapper';
import { CxCommandOutput } from "../main/wrapper/CxCommandOutput";
import { BaseTest } from "./BaseTest";

describe("Telemetry cases", () => {
    const cxScanConfig = new BaseTest();

    it.skip('TelemetryAIEvent Successful case with minimal parameters', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const timestamp = new Date();
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "Cursor", 
            "Cursos", 
            timestamp,
            "click",  
            "ast-results.viewPackageDetails",
            "secrets",   
            "high"    
        );
        console.log("Json object from telemetryAIEvent successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.exitCode).toBe(0);
    });

    it.skip('TelemetryAIEvent Successful case with past timestamp', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const pastTimestamp = new Date(Date.now() - 3600000); // 1 hour ago
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "openai",           
            "vscode",           
            pastTimestamp,      
            "click",
            "ast-results.viewPackageDetails",      
            "oss",             
            "high"              
        );
        console.log("Json object from telemetryAIEvent with past timestamp: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.exitCode).toBe(0);
    });

    it.skip('TelemetryAIEvent Successful case with edge case parameters', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const timestamp = new Date();
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "",              
            "",         
            timestamp,
            "",
            "",             
            "",          
            ""       
        );
        console.log("Json object from telemetryAIEvent with empty parameters: " + JSON.stringify(cxCommandOutput));
        expect(typeof cxCommandOutput.exitCode).toBe(0);
    });

    it.skip('TelemetryAIEvent Successful case without timestamp', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "Copilot",       
            "VS Code",  
            undefined,   
            "click",  
            "ast-results.viewPackageDetails",   
            "oss",        
            "medium" 
        );
        console.log("Json object from telemetryAIEvent without timestamp: " + JSON.stringify(cxCommandOutput));
        expect(typeof cxCommandOutput.exitCode).toBe(0);
    });
});