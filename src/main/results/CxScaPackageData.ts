import CxDependencyPaths from "./CxDependencyPaths";

export default class CxScaPackageData {
    id: string;
    locations: string [];
    dependencyPaths: CxDependencyPaths [];
    outdated: boolean;

    constructor(id: string,locations: string [],dependencyPaths: CxDependencyPaths [],outdated: boolean) {
        this.id = id;
        this.locations = locations;
        this.dependencyPaths = dependencyPaths;
        this.outdated = outdated;
    }
}