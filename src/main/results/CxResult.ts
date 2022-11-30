import CxData from "./CxData";
import CxVulnerabilityDetails from "./CxVulnerabilityDetails";

export default class CxResult {
    type: string;
    label:string;
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
    descriptionHTML: string;
    data: CxData;
    comments: any = {};
    vulnerabilityDetails:CxVulnerabilityDetails;

    constructor(type: string,label: string,id: string,status: string,similarityId: string,state: string,severity: string,created: string,firstFoundAt: string,foundAt: string,firstScanId:string,description: string,data: CxData,comments: any,vulnerabilityDetails: CxVulnerabilityDetails,descriptionHTML: string) {
        this.type = type;
        this.label = label;
        this.id = id;
        this.status = status;
        this.similarityId = similarityId;
        this.state = state;
        this.severity = severity;
        this.created = created;
        this.firstFoundAt = firstFoundAt;
        this.foundAt = foundAt;
        this.firstScanId = firstScanId;
        this.description = description;
        this.data = data;
        this.comments = comments;
        this.vulnerabilityDetails = vulnerabilityDetails;
        this.descriptionHTML = descriptionHTML;
    }
}

