import  {CxManifestStatus}  from './CxManifestStatus';

export default class CxOssResult {
    packageManager : string;
    packageName : string;
    version : string;
    filepath : string;
    lineStart : number;
    lineEnd : number;
    startIndex : number;
    endIndex : number;
    status :CxManifestStatus;


  static parseResult(resultObject: any): CxOssResult[] {
    let ossResults: CxOssResult[] = [];
    const ossResult = new CxOssResult();
    if (resultObject instanceof Array) {
        ossResults = resultObject.map((member: any) => {
        ossResult.packageManager = member.PackageManager;
        ossResult.packageName = member.PackageName;
        ossResult.version = member.Version;
        ossResult.filepath = member.Filepath;
        ossResult.lineStart = member.LineStart;
        ossResult.lineEnd = member.LineEnd;
        ossResult.startIndex = member.StartIndex;
        ossResult.endIndex = member.EndIndex;
        ossResult.status = member.Status as CxManifestStatus;
        return ossResult;
      });
    } else {
        ossResult.packageManager = resultObject.PackageManager;
        ossResult.packageName = resultObject.PackageName;
        ossResult.version = resultObject.Version;
        ossResult.filepath = resultObject.FilePath;
        ossResult.lineStart = resultObject.LineStart;
        ossResult.lineEnd = resultObject.LineEnd;
        ossResult.startIndex = resultObject.StartIndex;
        ossResult.endIndex = resultObject.EndIndex; 
        ossResult.status = resultObject.Status as CxManifestStatus;
        ossResults.push(ossResult);
    }
    return ossResults;
  }
}
