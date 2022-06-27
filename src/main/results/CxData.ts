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
}