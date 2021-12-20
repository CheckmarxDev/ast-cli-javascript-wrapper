export default class CxProject {
  id: string = " ";
  name: string = " ";
  createdAt: string = " ";
  updatedAt: string = " ";
  tags: object = {};
  groups: any = [];

  static parseProject(resultObject: any): CxProject[] {
    let projects: CxProject[] = [];
    if (resultObject instanceof Array) {
      projects = resultObject.map((member: any) => {
        let project = new CxProject();
        project.id = member.ID;
        project.name = member.Name;
        project.createdAt = member.CreatedAt;
        project.updatedAt = member.UpdatedAt;
        project.tags = member.Tags;
        project.groups = member.Groups;
        return project;
      });
    } else {
      let project = new CxProject();
      project.id = resultObject.ID;
      project.name = resultObject.Name;
      project.createdAt = resultObject.CreatedAt;
      project.updatedAt = resultObject.UpdatedAt;
      project.tags = resultObject.Tags;
      project.groups = resultObject.Groups;
      projects.push(project);
    }
    return projects;
  }
}
