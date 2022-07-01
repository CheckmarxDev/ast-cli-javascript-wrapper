export default class CxNode {
    id: string;
    line: number;
    name: string;
    column: number;
    length: number;
    method: string;
    nodeID: number;
    domType: string;
    fileName: string;
    fullName: string;
    typeName: string;
    methodLine: number;
    definitions: string;

    constructor(id: string,line: number,name: string,column: number,length: number,method: string,nodeID: number,domType: string,fileName: string,fullName:string,typeName: string,methodLine: number,definitions: string) {
        this.id = id;
        this.line = line;
        this.name = name;
        this.column = column;
        this.length = length;
        this.method = method;
        this.nodeID = nodeID;
        this.domType = domType;
        this.fileName = fileName;
        this.fullName = fullName;
        this.typeName = typeName;
        this.methodLine = methodLine;
        this.definitions = definitions;
    }
}