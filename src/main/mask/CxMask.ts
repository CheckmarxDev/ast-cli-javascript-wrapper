import CxMaskedSecret from "./CxMaskedSecret";

export default class CxMask {
    maskedSecrets: CxMaskedSecret[];
    maskedFile: string;

    constructor(maskedSecrets: CxMaskedSecret[], maskedFile: string) {
        this.maskedSecrets = maskedSecrets;
        this.maskedFile = maskedFile;
    }

    static parseMask(resultObject: any): CxMask {
        return new CxMask(resultObject.maskedSecrets,resultObject.maskedFile);
    }
}
