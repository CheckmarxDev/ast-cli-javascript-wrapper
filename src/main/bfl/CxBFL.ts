export default class CxBFL {
    column: number;
    fileName: string = "";
    fullName: string = "";
    length: number;
    line: number;
    methodLine: number;
    method: string = "";
    name: string = "";
    domType: string = "";


static parseBFLResponse(resultObject: any[]): CxBFL[] {
    let bflNode: CxBFL[] = [];
    bflNode = resultObject.map((member: any) => {
      let bflNode = new CxBFL();
      bflNode.column = member.column;
      bflNode.fileName = member.fileName;
      bflNode.fullName = member.fullName;
      bflNode.length = member.length;
      bflNode.line = member.line;
      bflNode.methodLine = member.methodLine;
      bflNode.method = member.method;
      bflNode.name = member.name;
      bflNode.domType = member.domType;
      return bflNode;
    });
    return bflNode;
  }
}