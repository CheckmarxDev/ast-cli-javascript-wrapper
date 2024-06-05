export default class VorpalScanDetail {
    rule_id: number;
    language: string;
    query_name: string;
    severity: string;
    file_name: string;
    line: number;
    length: number;
    remediation: string;
    description: string;

    constructor() {
        this.rule_id = 0;
        this.language = '';
        this.query_name = '';
        this.severity = '';
        this.file_name = '';
        this.line = 0;
        this.length = 0;
        this.remediation = '';
        this.description = '';
    }
}
