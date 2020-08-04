import { ProjectMaintenanceReport } from './project-maintenance-report';

export class ProjectReport {
    ProjectId:	number;
    CustName: string;
    ProjectName: string;
    ProjectDecription: string;
    ProjectStartDate: Date;
    ProjectEndDate: Date;
    ProjectEstimateCost: number;
    ProjectCurrencySymboy: string;
    ProjectDeliveryDate: Date;
    ProjectPaymentDate: Date;
    ProjectStatus: string;
    ProjectTotalEstimateCost: string;
    ProjectLeader: string;
    ProjectCoder: string;
    ProjectTester: string;

    ProjectMaintenanceReports: ProjectMaintenanceReport[];
}
