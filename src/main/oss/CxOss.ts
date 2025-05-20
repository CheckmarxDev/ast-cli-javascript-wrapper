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
    const packages = resultObject.Packages;
    let ossResults: CxOssResult[] = [];
    if (packages instanceof Array) {
        ossResults = packages.map((member: any) => {
        const ossResult = new CxOssResult();
        ossResult.packageManager = member.PackageManager;
                ossResult.packageName = member.PackageName;
                ossResult.version = member.PackageVersion;
                ossResult.filepath = member.FilePath;
                ossResult.lineStart = member.LineStart;
                ossResult.lineEnd = member.LineEnd;
                ossResult.startIndex = member.StartIndex;
                ossResult.endIndex = member.EndIndex;
                ossResult.status = member.Status as CxManifestStatus;
        return ossResult;
      });
    } else {
        const ossResult = new CxOssResult();
        ossResult.packageManager = packages.PackageManager;
        ossResult.packageName = packages.PackageName;
        ossResult.version = packages.PackageVersion;
        ossResult.filepath = packages.FilePath;
        ossResult.lineStart = packages.LineStart;
        ossResult.lineEnd = packages.LineEnd;
        ossResult.startIndex = packages.StartIndex;
        ossResult.endIndex = packages.EndIndex; 
        ossResult.status = packages.Status as CxManifestStatus;
        ossResults.push(ossResult);
    }
    return ossResults;
  }
}
