import { InjectionToken } from '@angular/core';
import { API_DOMAIN } from 'src/app/_configs/api';

export const API = {
    // GasStation
    Project: {
        LIST: API_DOMAIN + '/api/Project/all',
        CRUD: API_DOMAIN + '/api/project',
    },
    ProjectMaintenance: {
        LIST: API_DOMAIN + '/api/ProjectMaintenance/all',
        CRUD: API_DOMAIN + '/api/ProjectMaintenance',
    },
    ProjectMember: {
        LIST: API_DOMAIN + '/api/ProjectMember/all',
        ALLMEMBER: API_DOMAIN + '/api/Employee/All',
        DEPTMEMBER: API_DOMAIN + '/api/Employee/Department',
        GET:API_DOMAIN+'/api/ProjectMember',
        ADD: API_DOMAIN+'/api/ProjectMember/list'
    },
    MasterData: {
        GET: API_DOMAIN + '/api/Mst'
    },
    ProjectAttachmentFile: {
        DELETE: API_DOMAIN + '/api/AttachmentFile',
        DOWNLOAD: API_DOMAIN + '/api/AttachmentFile/Download',
        UPLOAD: API_DOMAIN + '/api/AttachmentFile/Upload',
        LIST: API_DOMAIN + '/api/AttachmentFile/Project',
        CRUD: API_DOMAIN + '/api/AttachmentFile/Project',
    }, ProjectMaintenanceAttachment: {
        DELETE: API_DOMAIN + '/api/AttachmentFile',
        DOWNLOAD: API_DOMAIN + '/api/AttachmentFile/Download',
        UPLOAD: API_DOMAIN + '/api/AttachmentFile/Upload',
        LIST: API_DOMAIN + '/api/AttachmentFile/ProjectMaintenance',
        CRUD: API_DOMAIN + '/api/AttachmentFile/ProjectMaintenance',
    },
    Customer:{
        LIST: API_DOMAIN + '/api/Customer',
    },
    MaintenanceMember: {
        LIST: API_DOMAIN + '/api/ProjectMaintenanceMember/all',
        ALLEMPLOYEE : API_DOMAIN + '/api/Employee/All',  
        DEPTEMPLOYEE : API_DOMAIN + '/api/Employee/Department',
        MstProjectPosition: API_DOMAIN + '/api/Mst',
        INSERT: API_DOMAIN + '/api/ProjectMaintenanceMember/list',
        DELETE: API_DOMAIN + '/api/ProjectMaintenanceMember',
    },
    //task
    Task:{
        LIST: API_DOMAIN + '/api/Task/Project',
        DELETETASK : API_DOMAIN + '/api/Task',
        UPDATE :API_DOMAIN +'/api/Task',
        ADD : API_DOMAIN + '/api/Task/Add/Project',
        GET : API_DOMAIN +'/api/Task',
        GET_ENDDATE : API_DOMAIN + '/api/Task/EndDate',
        MaintenanceTask:API_DOMAIN +'/api/Task/ProjectMaintenance',
        ADD_MaintenanceTask : API_DOMAIN + '/api/Task/Add/ProjectMaintenance'
    },
    Employee:{
        LIST: API_DOMAIN + '/api/Employee/All'
    }
   
};
