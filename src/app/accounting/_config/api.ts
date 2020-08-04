import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {
    MasterData: {
        GET: API_DOMAIN + '/api/Mst'
    },
    Salary:{
        LIST: API_DOMAIN + '/api/Salary/All',
        INSERT: API_DOMAIN + '/api/Salary',
        CheckApprovalDate: API_DOMAIN + '/api/Salary',
        lstEmployee: API_DOMAIN + '/api/Salary/All'
    },
    AccounttingSalary : {
        GetAllMonthlySalary : API_DOMAIN + '/api/MonthlySalary/All',
        GenerateMonthlySalary: API_DOMAIN + '/api/MonthlySalary',
        CheckExistsMonthlySalary: API_DOMAIN + '/api/MonthlySalary',
        UpdateMonthlySalary: API_DOMAIN + '/api/MonthlySalary',
        DeleteMonthlySalary: API_DOMAIN + '/api/MonthlySalary',
        DownloadReportMonthlySalary: API_DOMAIN + '/api/MonthlySalary/Report/Download',
        GetWageBonusImageOfPhotoshop : API_DOMAIN + '/api/MonthlyBonus',
        GetTotalImageBonus: API_DOMAIN + '/api/MonthlyBonus',
        GetAllMonthlyBonus: API_DOMAIN + '/api/MonthlyBonus/All',
        UpdateMonthlyBonus:  API_DOMAIN + '/api/MonthlyBonus',
        InsertMonthlyBonus: API_DOMAIN + '/api/MonthlyBonus',
        GetMonthlyBonusById: API_DOMAIN + '/api/MonthlyBonus',
        DeleteMonthlyBonus: API_DOMAIN + '/api/MonthlyBonus',
        GetWageOvertime: API_DOMAIN + '/api/MonthlyOT',
        GetAllMonthlyOT : API_DOMAIN + '/api/MonthlyOT/All',
        GetMonthlyOTById: API_DOMAIN + '/api/MonthlyOT',
        DeleteMonthlyOT:  API_DOMAIN + '/api/MonthlyOT',
        UpdateMonthlyOT:  API_DOMAIN + '/api/MonthlyOT',
        InsertMonthlyOT:  API_DOMAIN + '/api/MonthlyOT',
        lstEmployee: API_DOMAIN + '/api/Employee/All',
        CheckApprovalDate: API_DOMAIN + '/api/Salary',
        GetProjectFinish: API_DOMAIN + '/api/Project/Finish',
        GetTotalImageBasicMonth: API_DOMAIN + '/api/MonthlyBonus/totalImageBasic'
    }
};
