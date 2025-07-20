import { CxRealtimeEngineStatus } from './CxRealtimeEngineStatus';

export interface Location {
  line: number;
  startIndex: number;
  endIndex: number;
}

export default class CxContainerRealtimeResult {
  imageName: string;
  imageTag: string;
  filepath: string;
  locations: Location[];
  status: CxRealtimeEngineStatus;
  vulnerabilities: { cve: string, severity: string }[];

  static parseResult(resultObject: any): CxContainerRealtimeResult[] {
    const images = resultObject.Images;
    let imageResults: CxContainerRealtimeResult[] = [];
    if (images instanceof Array) {
      imageResults = images.map((member: any) => {
        const imageResult = new CxContainerRealtimeResult();
        imageResult.imageName = member.ImageName;
        imageResult.imageTag = member.ImageTag;
        imageResult.filepath = member.FilePath;
        imageResult.locations = Array.isArray(member.Locations)
          ? member.Locations.map((loc: any) => ({
            line: loc.Line,
            startIndex: loc.StartIndex,
            endIndex: loc.EndIndex
          }))
          : [];
        imageResult.status = member.Status as CxRealtimeEngineStatus;
        imageResult.vulnerabilities = Array.isArray(member.Vulnerabilities)
          ? member.Vulnerabilities.map((vul: any) => ({
            cve: vul.CVE,
            severity: vul.Severity
          }))
          : [];
        return imageResult;
      });
    } else {
      const imageResult = new CxContainerRealtimeResult();
      imageResult.imageName = images.PackageManager;
      imageResult.imageTag = images.PackageName;
      imageResult.filepath = images.FilePath;
      imageResult.locations = Array.isArray(images.Locations)
        ? images.Locations.map((loc: any) => ({
          line: loc.Line,
          startIndex: loc.StartIndex,
          endIndex: loc.EndIndex
        }))
        : [];
      imageResult.status = images.Status as CxRealtimeEngineStatus;
      imageResult.vulnerabilities = Array.isArray(images.Vulnerabilities)
    ? images.Vulnerabilities.map((vul: any) => ({
        cve: vul.CVE,
        severity: vul.Severity
      }))
    : [];
      imageResults.push(imageResult);
    }
    return imageResults;
  }
}
