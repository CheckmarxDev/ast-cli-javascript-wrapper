export default class CxPackageData {
    comment: string;
    type: string;
    url: string;

    constructor(comment: string,type: string,url: string) {
        this.comment = comment;
        this.type = type;
        this.url = url;
    }
}