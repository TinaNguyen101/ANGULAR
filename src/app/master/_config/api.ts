import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {

    MasterData: {
        GET: API_DOMAIN + '/api/Mst'
    },
    MASTERLIST:{
        LIST: API_DOMAIN + '/api/Customer/all',
        CRUD : API_DOMAIN + '/api/Customer',
    },
    //master-annual-holiday
    MASTER_ANNUALHOLIDAY:{
        CRUD: API_DOMAIN + '/api/Holiday',
        LIST: API_DOMAIN + '/api/Holiday/All'
    }
    EVALUATOR:{
        LIST: API_DOMAIN + '/api/Evaluator/All',
        CRUD: API_DOMAIN + '/api/Evaluator',
    },
};
