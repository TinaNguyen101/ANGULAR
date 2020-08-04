export class ProjectMaintenanceMember {
    ProjectMaintenanceId:	Number;
    Id: Number;
    EmpId	:Number;
    ProjectPositionId: Number;
    EmpName:	string;
    ProjectPositionName:	string;
}
export class Member {
    Id: Number;
    ProjectId: Number;
    EmpId: Number;
    ProjectPositionId: Number;
    ProjectMaintenanceId: Number;
}
export class memberMaintenance{
    ProjectMaintenanceId: Number;
    Id: Number;
    EmpId: Number;
    ProjectPositionId: Number;
    EmpName:	string;
    ProjectPositionName:	string;
    StyleCss:	string;
    EmpMobile1:	string;
    EmpEmail1:	string;
    EmpImage:	string;
    EmpGender: Number;
}