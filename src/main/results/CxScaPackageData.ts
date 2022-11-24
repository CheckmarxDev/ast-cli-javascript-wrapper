import CxDependencyPaths from "./CxDependencyPaths";

export default class CxScaPackageData {
    id: string;
    locations: string [];
    dependencyPaths: CxDependencyPaths [];
    outdated: boolean;
    fixLink:string
    supportsQuickFix:boolean;
    isDirectDependency:boolean;

    constructor(id: string,locations: string [],dependencyPaths: CxDependencyPaths [],outdated: boolean,fixLink:string,supportsQuickFix:boolean,isDirectDependency:boolean) {
        this.id = id;
        this.locations = locations;
        this.dependencyPaths = dependencyPaths;
        this.outdated = outdated;
        this.fixLink = fixLink;
        this.supportsQuickFix = supportsQuickFix;
        this.isDirectDependency = isDirectDependency;
    }
}