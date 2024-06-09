export default class VorpalScanDetail {
    ruleId: number;
    language: string;
    queryName: string;
    severity: string;
    fileName: string;
    line: number;
    length: number;
    remediation: string;
    description: string;

    constructor() {
        this.ruleId = 0;
        this.language = '';
        this.queryName = '';
        this.severity = '';
        this.fileName = '';
        this.line = 0;
        this.length = 0;
        this.remediation = '';
        this.description = '';
    }
}
