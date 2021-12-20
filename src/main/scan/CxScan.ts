export default class CxScan {
  id: string = "";
  projectID: string = "";
  status: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  tags: object = {};
  groups: any = [];
  initiator: string = "";
  origin: string = "";
  branch: string = "";

  static parseProject(resultObject: any): CxScan[] {
    let scans: CxScan[] = [];
    if (resultObject instanceof Array) {
      scans = resultObject.map((member: any) => {
        let scan = new CxScan();
        scan.id = member.ID;
        scan.projectID = member.ProjectID;
        scan.status = member.Status;
        scan.createdAt = member.CreatedAt;
        scan.updatedAt = member.UpdatedAt;
        scan.tags = member.Tags;
        scan.groups = member.Groups;
        scan.origin = member.Origin;
        scan.initiator = member.Initiator;
        scan.branch = member.Initiator;
        return scan;
      });
    } else {
      let scan = new CxScan();
      scan.id = resultObject.ID;
      scan.projectID = resultObject.ProjectID;
      scan.status = resultObject.Status;
      scan.createdAt = resultObject.CreatedAt;
      scan.updatedAt = resultObject.UpdatedAt;
      scan.tags = resultObject.Tags;
      scan.groups = resultObject.Groups;
      scan.origin = resultObject.Origin;
      scan.initiator = resultObject.Initiator;
      scan.branch = resultObject.Initiator;
      scans.push(scan);
    }
    return scans;
  }
}
