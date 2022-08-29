import CxDependencyPaths from "./CxDependencyPaths";

export default class CxScaPackageData {
    id: string;
    locations: string [];
    dependencyPaths: CxDependencyPaths [];
    outdated: boolean;
    fixLink:string
    supportsQuickFix:boolean;

    constructor(id: string,locations: string [],dependencyPaths: CxDependencyPaths [],outdated: boolean,fixLink:string,supportsQuickFix:boolean) {
        this.id = id;
        this.locations = locations;
        this.dependencyPaths = dependencyPaths;
        this.outdated = outdated;
        this.fixLink = fixLink;
        this.supportsQuickFix = supportsQuickFix;
    }
}