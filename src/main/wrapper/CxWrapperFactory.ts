import {CxWrapper} from "./CxWrapper";
import {CxConfig} from "./CxConfig";

class CxWrapperFactory {
    static async createWrapper(cxScanConfig: CxConfig, logFilePath?: string): Promise<CxWrapper> {
        let wrapper: CxWrapper;
        wrapper = await CxWrapper.getInstance(cxScanConfig, logFilePath);
        await wrapper.init();
        return wrapper;
    }
}

export default CxWrapperFactory;