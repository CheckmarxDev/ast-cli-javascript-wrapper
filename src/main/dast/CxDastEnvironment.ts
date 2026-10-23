export default class CxDastEnvironment {
  id: string;
  name: string;
  url: string;
  scanType: string;
  createdAt: string;
  riskRating: string;
  lastScanTime: string;
  lastStatus: string

  static parseDastEnvironment(resultObject: any): CxDastEnvironment[] {
    let environments: CxDastEnvironment[] = [];

    const parseDastEnvironmentResult = (result: any): CxDastEnvironment => {
      const environment = new CxDastEnvironment();
      environment.id = result.EnvironmentID;
      environment.name = result.Domain;
      environment.url = result.URL;
      environment.scanType = result.ScanType;
      environment.createdAt = result.Created;
      environment.riskRating = result.RiskRating;
      environment.lastScanTime = result.LastScanTime;
      environment.lastStatus = result.LastStatus;
      return environment;
    }

    if (resultObject instanceof Array) {
      environments = resultObject.map((result: any) => parseDastEnvironmentResult(result));
    } else {
      const environment = parseDastEnvironmentResult(resultObject)
      environments.push(environment);
    }
    return environments;
  }
}
