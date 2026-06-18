export interface CheckPendingAuthorizationsData {
  certificatesToApprove: number;
  maxCreatedAt: string;
  minCreatedAt: string;
  canUserAuthorize: boolean;
}

export interface CheckPendingAuthorizationsResponse {
  data: CheckPendingAuthorizationsData;
  message: string;
}
