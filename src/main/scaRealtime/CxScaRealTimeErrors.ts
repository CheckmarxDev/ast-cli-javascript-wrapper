export default class CxScaRealTimeErrors {
    message: string;
    filename: string;

    static parseScaRealTimeResponseError(errorObject: any): CxScaRealTimeErrors {
        const cxScaRealTimeErrors: CxScaRealTimeErrors = new CxScaRealTimeErrors();
        cxScaRealTimeErrors.message = errorObject.message;
        cxScaRealTimeErrors.filename = errorObject.filename;

        return cxScaRealTimeErrors;
    }
}