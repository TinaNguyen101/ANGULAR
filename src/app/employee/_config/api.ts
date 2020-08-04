import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {
    // // GasStation
    // ProjectReport: {
    //     Report: API_DOMAIN + '/api/Project/Report',
    //     ReportStatistics: API_DOMAIN + '/api/Project/ReportStatistics',
    //     ReportStatisticsByCust: API_DOMAIN + '/api/Project/ReportStatisticsByCust',
    // }
    MasterData: {
        GET: API_DOMAIN + '/api/Mst'
    },
    Employee: {
        CRUD: API_DOMAIN + '/api/Employee',
        LIST: API_DOMAIN + '/api/Employee/All',
        AnnualLeavePaid: API_DOMAIN + '/api/AnnualLeavePaid/All?year=',
        DownloadAnnualLeavePaid: API_DOMAIN + '/api/AnnualLeavePaid/Report/Download/year?year=',
        EmployeeById: API_DOMAIN + '/api/Employee',
        Create_UpdateEmpployee: API_DOMAIN + '/api/Employee',
        Approved: API_DOMAIN + '/api/Employee/Approved',
        UploadEmpImage: API_DOMAIN + '/api/Employee/Upload'

    },
    AnnualRatingFactor: {
        LIST: API_DOMAIN + '/api/AnnualRatingFactor/All',
        YEAR: API_DOMAIN + '/api/AnnualRatingFactor',
        AddAnnualLeavePaid: API_DOMAIN + '/api/AnnualLeavePaid?year='

    },
    DayOff: {
        UpdateDayOff: API_DOMAIN + '/api/DayOff',
        AllDayOff: API_DOMAIN + '/api/DayOff?yearMonth=',
        DeleteDayOff: API_DOMAIN + '/api/DayOff/',
        CheckExistDayoff: API_DOMAIN + '/api/DayOff/CheckExist',

    },
    Bonus: {
        Main: API_DOMAIN + '/api/AnnualBonus',
        GetAllBouusForEmpByYear: API_DOMAIN + '/api/AnnualBonus/All/Employee',
        GetProjectFinish: API_DOMAIN + '/api/Project/Finish',
        GetBonus: API_DOMAIN + '/api/AnnualBonus/Bonus/Member',
        GetBonusLeader: API_DOMAIN + 'api/AnnualBonus/Bonus/Leader',
        GetAnnualRatingFactor: API_DOMAIN + '/api/AnnualRatingFactor/Employee',
        GetTop1Salary: API_DOMAIN + '/api/Salary',
        AutoCreate: API_DOMAIN + '/api/AnnualBonus/Bonus/AutoGenarate',
        CheckYearAnnualLeavePaid: API_DOMAIN + '/api/AnnualLeavePaid',
        GetDayAndBonusNember : API_DOMAIN + '/api/AnnualBonus/Day/Member'
    },
    EmployeeAttachmentFile: {
        DELETE: API_DOMAIN + '/api/AttachmentFile',
        DOWNLOAD: API_DOMAIN + '/api/AttachmentFile/Download',
        UPLOAD: API_DOMAIN + '/api/AttachmentFile/Upload',
        LIST: API_DOMAIN + '/api/AttachmentFile/Employee',
        CRUD: API_DOMAIN + '/api/AttachmentFile/Employee',
    },        
    KPIAnnual: {
        ListEvaluator : API_DOMAIN + '/api/KPI/Evaluator',
    },
    AnnualEvaluationResult: {
        ListEvalutionResult: API_DOMAIN + '/api/KPI/AnnualEvaluationResult',
        UpdateEvaluationResult: API_DOMAIN +'/api/KPI/AnnualEvaluationResult',
        AddEvaluationResult : API_DOMAIN +'/api/KPI/AnnualEvaluationResult'    
    },    
    AnnualKPIResult:{
        ListAnnualKPIResult: API_DOMAIN +'/api/KPI/AnnualKPIResult',
        UpdateAnnualKPIResult: API_DOMAIN +'/api/KPI/AnnualKPIResult',
    },
    AnnualReview:{
        ListAnnualReview: API_DOMAIN +'/api/KPI/AnnualReview',
        UpdateAnnualReview :API_DOMAIN +'/api/KPI/AnnualReview',
    }    
}
