export interface Location {
    Line: number;
    StartIndex: number;
    EndIndex: number;
}

export interface Vulnerability {
    CVE: string;
    Description: string;
    Severity: string;
}

export interface OssPackage {
    PackageManager: string;
    PackageName: string;
    PackageVersion: string;
    FilePath: string;
    Locations: Location[];
    Status: string;
    Vulnerabilities: Vulnerability[];
}
