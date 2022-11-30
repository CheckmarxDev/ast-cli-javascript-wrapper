import CxDependencyPaths from "./CxDependencyPaths";

export default class CxScaPackageData {
    id: string;
    locations: string [];
    dependencyPaths: CxDependencyPaths [];
    outdated: boolean;
    fixLink:string
    supportsQuickFix:boolean;
    typeOfDependency:string;

    constructor(id: string,locations: string [],dependencyPaths: CxDependencyPaths [],outdated: boolean,fixLink:string,supportsQuickFix:boolean,typeOfDependency:string) {
        this.id = id;
        this.locations = locations;
        this.dependencyPaths = dependencyPaths;
        this.outdated = outdated;
        this.fixLink = fixLink;
        this.supportsQuickFix = supportsQuickFix;
        this.typeOfDependency = typeOfDependency;
    }
}