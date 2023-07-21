export default class CxMaskedSecret {
    masked: string;
    secret: string;
    line: number;

    constructor(masked: string, secret: string, line: number) {
        this.masked = masked;
        this.secret = secret;
        this.line = line;
    }
}
