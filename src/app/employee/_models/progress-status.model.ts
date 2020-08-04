export interface ProgressStatus {
    status: ProgressStatusEnum;
    percentage?: number;
    fileName?: string;
  }
  
  export enum ProgressStatusEnum {
    START, COMPLETE, IN_PROGRESS, ERROR
  }