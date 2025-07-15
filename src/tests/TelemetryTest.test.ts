import { CxWrapper } from '../main/wrapper/CxWrapper';
import { CxCommandOutput } from "../main/wrapper/CxCommandOutput";
import { BaseTest } from "./BaseTest";

describe("Telemetry cases", () => {
    const cxScanConfig = new BaseTest();

    it.skip('TelemetryAIEvent Successful case with minimal parameters', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "Cursor", 
            "Cursos", 
            "click",  
            "ast-results.viewPackageDetails",
            "secrets",   
            "high"    
        );
        console.log("Json object from telemetryAIEvent successful case: " + JSON.stringify(cxCommandOutput));
        expect(cxCommandOutput.exitCode).toBe(0);
    });


    it.skip('TelemetryAIEvent Successful case with edge case parameters', async () => {
        const wrapper = new CxWrapper(cxScanConfig);
        const cxCommandOutput: CxCommandOutput = await wrapper.telemetryAIEvent(
            "",              
            "",         
            "",
            "",             
            "",          
            ""       
        );
        console.log("Json object from telemetryAIEvent with empty parameters: " + JSON.stringify(cxCommandOutput));
        expect(typeof cxCommandOutput.exitCode).toBe(0);
    });
});