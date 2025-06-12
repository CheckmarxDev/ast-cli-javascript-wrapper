import {CxRealtimeEngineStatus} from "../oss/CxRealtimeEngineStatus";

export default class CxSecretsResult {
    title: string;
    description: string;
    filepath: string;
    severity: CxRealtimeEngineStatus;
    locations: { line: number, startIndex: number, endIndex: number }[];

    static parseResult(resultObject: any): CxSecretsResult[] {
        let secretsResults: CxSecretsResult[] = [];
        if (resultObject instanceof Array) {
            secretsResults = resultObject.map((member: any) => {
                const secretsResult = new CxSecretsResult();
                secretsResult.title = member.Title;
                secretsResult.description = member.Description;
                secretsResult.filepath = member.FilePath;
                secretsResult.severity = member.Severity as CxRealtimeEngineStatus;
                secretsResult.locations = Array.isArray(member.Locations)
                    ? member.Locations.map((l: any) => ({
                        line: l.Line,
                        startIndex: l.StartIndex,
                        endIndex: l.EndIndex,
                    }))
                    : [];
                return secretsResult;
            });
        } else {
            const secretsResult = new CxSecretsResult();
            secretsResult.title = resultObject.Title;
            secretsResult.description = resultObject.Description;
            secretsResult.severity = resultObject.Severity;
            secretsResult.filepath = resultObject.FilePath;
            secretsResult.filepath = resultObject.FilePath;
            secretsResult.locations = Array.isArray(resultObject.Locations)
                ? resultObject.Locations.map((l: any) => ({
                    line: l.Line,
                    startIndex: l.StartIndex,
                    endIndex: l.EndIndex,
                }))
                : [];
            secretsResults.push(secretsResult);
        }
        return secretsResults;
    }
}
