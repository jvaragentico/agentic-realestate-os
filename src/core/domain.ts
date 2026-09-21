export type Id=string;
export interface TenantEntity{id:Id;organizationId:Id;createdAt:string;updatedAt:string}
export interface Party extends TenantEntity{kind:"person"|"organization";displayName:string}
export interface Asset extends TenantEntity{assetType:string;status:string}
export interface Opportunity extends TenantEntity{partyId:Id;assetId?:Id;stage:string;objective:string}
export type ExecutionClass="autonomous"|"policy_controlled"|"human_approval";
