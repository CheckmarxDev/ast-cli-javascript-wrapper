import { CxRealtimeEngineStatus } from './CxRealtimeEngineStatus';

export interface Location {
  line: number;
  startIndex: number;
  endIndex: number;
}

export default class CxOssResult {
  packageManager: string;
  packageName: string;
  version: string;
  filepath: string;
  locations: Location[];
  status: CxRealtimeEngineStatus;
  vulnerabilities: { cve: string, description: string, severity: string }[];

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
        ossResult.locations = Array.isArray(member.Locations)
          ? member.Locations.map((loc: any) => ({
            line: loc.Line,
            startIndex: loc.StartIndex,
            endIndex: loc.EndIndex
          }))
          : [];
        ossResult.status = member.Status as CxRealtimeEngineStatus;
        ossResult.vulnerabilities = Array.isArray(member.Vulnerabilities)
          ? member.Vulnerabilities.map((vul: any) => ({
            cve: vul.CVE,
            description: vul.Description,
            severity: vul.Severity
          }))
          : [];
        return ossResult;
      });
    } else {
      const ossResult = new CxOssResult();
      ossResult.packageManager = packages.PackageManager;
      ossResult.packageName = packages.PackageName;
      ossResult.version = packages.PackageVersion;
      ossResult.filepath = packages.FilePath;
      ossResult.locations = Array.isArray(packages.Locations)
        ? packages.Locations.map((loc: any) => ({
          line: loc.Line,
          startIndex: loc.StartIndex,
          endIndex: loc.EndIndex
        }))
        : [];
      ossResult.status = packages.Status as CxRealtimeEngineStatus;
      ossResult.vulnerabilities = Array.isArray(packages.Vulnerabilities)
    ? packages.Vulnerabilities.map((vul: any) => ({
        cve: vul.CVE,
        description: vul.Description,
        severity: vul.Severity
      }))
    : [];
      ossResults.push(ossResult);
    }
    return ossResults;
  }
}
