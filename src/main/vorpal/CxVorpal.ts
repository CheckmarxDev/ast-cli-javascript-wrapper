import VorpalScanDetail from "./VorpalScanDetail";

export default class CxVorpal {
    request_id: string;
    status: boolean;
    message: string;
    scan_details: VorpalScanDetail[];
    error: any;

    constructor() {
        this.request_id = '';
        this.status = false;
        this.message = '';
        this.scan_details = [];
        this.error = null;
    }

    static parseScan(resultObject: any): CxVorpal {
        const scan = new CxVorpal();
        scan.request_id = resultObject.request_id;
        scan.status = resultObject.status;
        scan.message = resultObject.message;
        scan.error = resultObject.error;

        if (resultObject.scan_details instanceof Array) {
            scan.scan_details = resultObject.scan_details.map((detail: any) => {
                const scanDetail = new VorpalScanDetail();
                scanDetail.rule_id = detail.rule_id;
                scanDetail.language = detail.language;
                scanDetail.query_name = detail.query_name;
                scanDetail.severity = detail.severity;
                scanDetail.file_name = detail.file_name;
                scanDetail.line = detail.line;
                scanDetail.length = detail.length;
                scanDetail.remediation = detail.remediation;
                scanDetail.description = detail.description;
                return scanDetail;
            });
        }

        return scan;
    }
}
