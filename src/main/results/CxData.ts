import CxPackageData from "./CxPackageData";
import CxScaPackageData from "./CxScaPackageData";
import CxNode from "./CxNode";

export default class CxData {
    packageData:  CxPackageData[];
    packageIdentifier: string;
    scaPackageData: CxScaPackageData;
    queryId: string;
    queryName: string;
    group: string;
    resultHash: string;
    languageName: string;
    nodes: CxNode[];
    recommendedVersion: string;

    constructor(packageData: CxPackageData[],packageIdentifier: string,scaPackageData: CxScaPackageData,queryId: string,queryName: string,group: string,resultHash: string,languageName: string,nodes: CxNode[],recommendedVersion:string) {
        this.packageData = packageData;
        this.packageIdentifier = packageIdentifier;
        this.scaPackageData = scaPackageData;
        this.queryId = queryId;
        this.queryName = queryName;
        this.group = group;
        this.resultHash = resultHash;
        this.languageName = languageName;
        this.nodes = nodes;
        this.recommendedVersion=recommendedVersion;
    }
}