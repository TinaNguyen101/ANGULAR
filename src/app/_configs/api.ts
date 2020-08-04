import { InjectionToken } from '@angular/core';

export const API_DOMAIN = 'http://192.168.1.213:81';

export const API = {
    MasterData: {
        GET: API_DOMAIN + '/api/Mst'
    },
    CurrencyRate: {
        GET: 'https://free.currconv.com/api/v7/convert'
    },
};
