export default class CxKicsRemediation {
    availableRemediation: string;
    appliedRemediation: string;

    constructor(availableRemediation: string,appliedRemediation: string) {
        this.availableRemediation = availableRemediation;
        this.appliedRemediation = appliedRemediation;
    }

    static parseKicsRemediation(resultObject: any): CxKicsRemediation {
        const output: CxKicsRemediation = new CxKicsRemediation(resultObject.available_remediation_count,resultObject.applied_remediation_count);
        return output;
    }
}
