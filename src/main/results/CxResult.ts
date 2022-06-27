import CxData from "./CxData";
import CxVulnerabilityDetails from "./CxVulnerabilityDetails";

export default class CxResult {
    type: string;
    id: string;
    status: string;
    similarityId :string;
    state: string;
    severity: string;
    created: string;
    firstFoundAt: string;
    foundAt: string;
    firstScanId: string;
    description: string;
    data: CxData;
    comments: any = {};
    vulnerabilityDetails:CxVulnerabilityDetails;
}