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
    data: any = {};
    comments: any = {};
    vulnerabilityDetails:object = {};
}