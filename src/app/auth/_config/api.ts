import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {
    // GasStation
    AUTH: {
        LOGIN: API_DOMAIN + '/api/user/authenticate',
    },
};
