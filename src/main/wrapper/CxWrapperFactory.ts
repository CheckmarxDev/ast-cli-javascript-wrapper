// ICxWrapperFactory.ts
import { CxWrapper } from "./CxWrapper";
import { CxConfig } from "./CxConfig";

export interface ICxWrapperFactory {
    createWrapper(cxScanConfig: CxConfig, logFilePath?: string): Promise<CxWrapper>;
}

class CxWrapperFactory implements ICxWrapperFactory {
    async createWrapper(cxScanConfig: CxConfig, logFilePath?: string): Promise<CxWrapper> {
        return await CxWrapper.getInstance(cxScanConfig, logFilePath);
    }
}

export default CxWrapperFactory;
