export default class CxCvss {
    version:string;
    attackVector:string;
    availability:string;
    confidentiality:string;
    attackComplexity:string;
    integrityImpact:string;
    scope:string;
    privilegesRequired:string;
    userInteraction:string;

    constructor(version: string,attackVector: string,availability: string,confidentiality: string,attackComplexity:string,integrityImpact:string,scope:string,privilegesRequired:string,userInteraction:string) {
        this.version = version;
        this.attackVector = attackVector;
        this.availability = availability;
        this.confidentiality = confidentiality;
        this.attackComplexity = attackComplexity;
        this.integrityImpact = integrityImpact;
        this.scope = scope;
        this.privilegesRequired = privilegesRequired;
        this.userInteraction = userInteraction;
    }
}