import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {
    // GasStation
    ProjectReport: {
        Report: API_DOMAIN + '/api/Project/Report',
        ReportStatistics: API_DOMAIN + '/api/Project/ReportStatistics',
        ReportStatisticsByCust: API_DOMAIN + '/api/Project/ReportStatisticsByCust',
    },

    EmployeeReport : {
        Report: API_DOMAIN + '/api/Employee',
        ReportEmployeeVehicle: API_DOMAIN + '/api/Employee/Report/EmployeeVehicle?yearMonth=',
        ReportDowloadFileEmployeeVehicle: API_DOMAIN + '/api/Employee/Report/EmployeeVehicle/Download?yearMonth=',
        ReportDowloadFileEmployeeList: API_DOMAIN + '/api/Employee/Report/Employee/Download?yearMonth=',
        ReportDowloadFileAnnualLeavePaidForMonth: API_DOMAIN + '/api/AnnualLeavePaid/Report/Download/month?yearMonth=',
        ReportDowloadFileAnnualLeavePaidForYear: API_DOMAIN + '/api/AnnualLeavePaid/Report/Download/year?year=',
        ReportDowloadFileKPIForYear: API_DOMAIN + '/api/KPI/Report/Download?year=',



    },
    ReportAccounting : {
        LIST_MONTHLY_SALARY : API_DOMAIN + '/api/MonthlySalary/Report',
        DOWNLOAD_LIST_YEARMONTH: API_DOMAIN + '/api/MonthlySalary/Report/Download',
        LIST_ANNUAL_BONUS : API_DOMAIN + '/api/AnnualBonus/Report',
        DOWNLOAD_ANNUAL_BONUS : API_DOMAIN + '/api/AnnualBonus/Report/Download',
    }




};
