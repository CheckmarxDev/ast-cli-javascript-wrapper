import {BaseTest} from "./BaseTest";
import {CxWrapper} from '../main/wrapper/CxWrapper';
import {CxCommandOutput} from "../main/wrapper/CxCommandOutput";

describe("Engine cases",()=>{
    const cxScanConfig = new BaseTest();

    it("ALL Engine  API List case",async ()=>{
        const auth = new CxWrapper(cxScanConfig);
        const engineList: CxCommandOutput  = await auth.engineList("");
        expect(engineList.payload.length).toBeGreaterThanOrEqual(0);
        expect(engineList.payload.some(engine => engine.EngineName === "SAST")).toBe(true);
        expect(engineList.payload.some(engine => engine.EngineName === "SCA")).toBe(true);
        expect(engineList.payload.some(engine => engine.EngineName === "DAST")).toBe(true);
    });

    it("SAST Engine  API List case",async ()=>{
        const auth = new CxWrapper(cxScanConfig);
        const engineList: CxCommandOutput  = await auth.engineList("sast");
        expect(engineList.payload.length).toBeGreaterThanOrEqual(0);
        expect(engineList.payload.some(engine => engine.EngineName === "SAST")).toBe(true);
        expect(engineList.payload.some(engine => engine.EngineName === "SCA")).toBe(false);
        expect(engineList.payload.some(engine => engine.EngineName === "DAST")).toBe(false);
    });

    it("SCA Engine  API List case",async ()=>{
        const auth = new CxWrapper(cxScanConfig);
        const engineList: CxCommandOutput  = await auth.engineList("sca");
        expect(engineList.payload.length).toBeGreaterThanOrEqual(0);
        expect(engineList.payload.some(engine => engine.EngineName === "SAST")).toBe(false);
        expect(engineList.payload[0].EngineName).toBe("SCA");
        expect(engineList.payload.some(engine => engine.EngineName === "DAST")).toBe(false);
    });
})