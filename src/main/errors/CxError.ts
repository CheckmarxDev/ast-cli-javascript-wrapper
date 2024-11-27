export class CxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CxError";
    }
}