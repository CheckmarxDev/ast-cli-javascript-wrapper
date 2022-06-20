export default class CxCodeBashing {
  path: string;
  cweId: string;
  language: string;
  queryName: string;

  static parseCodeBashing(resultObject: any[]): CxCodeBashing[] {
    let codeBashingLink: CxCodeBashing[] = [];
    codeBashingLink = resultObject.map((member: any) => {
      const codeBashing = new CxCodeBashing();
      codeBashing.path = member.path;
      codeBashing.cweId = member.cwe_id;
      codeBashing.language = member.lang;
      codeBashing.queryName = member.cxQueryName;
      return codeBashing;
    });
    return codeBashingLink;
  }
}
