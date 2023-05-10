import CxScaRealTimeErrors from "./CxScaRealTimeErrors";

export default class CxScaRealTime {
    totalCount: string;
    results: any = [];
    errors : CxScaRealTimeErrors[];
    static parseScaRealTimeResponse(resultObject: any): CxScaRealTime {
        const scaRealTime: CxScaRealTime = new CxScaRealTime();
        scaRealTime.totalCount = resultObject.totalCount;
        scaRealTime.results = resultObject.results || [];
        scaRealTime.errors = resultObject.errors ? resultObject.errors.map((errorObject: any) => CxScaRealTimeErrors.parseScaRealTimeResponseError(errorObject)) : [];

        return scaRealTime;
    }
}