// ICxWrapperFactory.ts
import { CxWrapper } from "./CxWrapper";
import { CxConfig } from "./CxConfig";

export interface ICxWrapperFactory {
    createWrapper(cxScanConfig: CxConfig, logFilePath?: string): Promise<CxWrapper>;
}

class CxWrapperFactory implements ICxWrapperFactory {
    async createWrapper(cxScanConfig: CxConfig, logFilePath?: string): Promise<CxWrapper> {
        const wrapper = await CxWrapper.getInstance(cxScanConfig, logFilePath);
        await wrapper.init();
        return wrapper;
    }
}

export default CxWrapperFactory;
