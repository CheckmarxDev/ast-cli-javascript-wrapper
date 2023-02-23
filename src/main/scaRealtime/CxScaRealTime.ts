export default class CxScaRealTime {
    totalCount: string;
    results: any = [];

    static parseScaRealTimeResponse(resultObject: any): CxScaRealTime {
        const scaRealTime: CxScaRealTime = new CxScaRealTime();
        scaRealTime.totalCount = resultObject.totalCount;
        scaRealTime.results = resultObject.results || [];

        return scaRealTime;
    }
}