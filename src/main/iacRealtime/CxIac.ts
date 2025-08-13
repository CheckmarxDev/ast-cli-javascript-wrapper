import {CxRealtimeEngineStatus} from "../oss/CxRealtimeEngineStatus";

export default class CxIacResult {
    title: string;
    description: string;
    similarityID: string;
    filepath: string;
    severity: CxRealtimeEngineStatus;
    expectedValue: string;
    actualValue: string;
    locations: { line: number, startIndex: number, endIndex: number }[];

    static parseResult(resultObject: any): CxIacResult[] {
        let iacResults: CxIacResult[] = [];
        if (resultObject instanceof Array) {
            iacResults = resultObject.map((member: any) => {
                const iacResult = new CxIacResult();
                iacResult.title = member.Title;
                iacResult.description = member.Description;
                iacResult.similarityID = member.SimilarityID;
                iacResult.filepath = member.FilePath;
                iacResult.severity = member.Severity as CxRealtimeEngineStatus;
                iacResult.expectedValue = member.ExpectedValue;
                iacResult.actualValue = member.ActualValue;
                iacResult.locations = Array.isArray(member.Locations)
                    ? member.Locations.map((l: any) => ({
                        line: l.Line,
                        startIndex: l.StartIndex,
                        endIndex: l.EndIndex,
                    }))
                    : [];
                return iacResult;
            });
        } else {
            const iacResult = new CxIacResult();
            iacResult.title = resultObject.Title;
            iacResult.description = resultObject.Description;
            iacResult.severity = resultObject.Severity;
            iacResult.filepath = resultObject.FilePath;
            iacResult.filepath = resultObject.FilePath;
            iacResult.locations = Array.isArray(resultObject.Locations)
                ? resultObject.Locations.map((l: any) => ({
                    line: l.Line,
                    startIndex: l.StartIndex,
                    endIndex: l.EndIndex,
                }))
                : [];
            iacResults.push(iacResult);
        }
        return iacResults;
    }
}
