export default class CxEngineListAPI {
    engineId: string;
    engineName: string;
    engineApiName: string;
    engineApiURL: string;
    engineDescription: string;
  
    static parseEngineApis(resultObject: any): CxEngineListAPI[] {
      let engineApiList: CxEngineListAPI[] = [];
      if (resultObject instanceof Array) {
        engineApiList = resultObject.map((member: any) => {
          const engines = new CxEngineListAPI();
          engines.engineId = member.EngineId;
          engines.engineApiName = member.EngineName;
          engines.engineApiName = member.ApiName;
          engines.engineApiURL = member.ApiURL;
          engines.engineDescription = member.Description;
          return engines;
        });
      } 
      return engineApiList;
    }
  }
  