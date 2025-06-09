export default class CxSecretsResult {
    title: string;
    description: string;
    filepath: string;
    severity: string;
    locations: { line: number, startIndex: number, endIndex: number }[];

    static parseResult(resultObject: any): CxSecretsResult[] {
        const results = resultObject.Packages;
        let secretsResults: CxSecretsResult[] = [];
        if (results instanceof Array) {
            secretsResults = results.map((member: any) => {
                const secretsResult = new CxSecretsResult();
                secretsResult.title = member.Title;
                secretsResult.description = member.Description;
                secretsResult.filepath = member.FilePath;
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
            secretsResult.title = results.Title;
            secretsResult.description = results.Description;
            secretsResult.filepath = results.FilePath;
            secretsResult.filepath = results.FilePath;
            secretsResult.locations = Array.isArray(results.Locations)
                ? results.Locations.map((l: any) => ({
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
