export default class CxKicsRealTime {
    version: string = "";
    count: string = "";
    summary : any = {};
    results: any = [];

    static parseKicsRealTimeResponse(resultObject: any): CxKicsRealTime {
        let kicsRealTime: CxKicsRealTime = new CxKicsRealTime();
        kicsRealTime.version = resultObject.kics_version;
        kicsRealTime.count = resultObject.total_counter;
        kicsRealTime.results = resultObject.queries;
        kicsRealTime.summary = resultObject.severity_counters;
        return kicsRealTime;
    }
}