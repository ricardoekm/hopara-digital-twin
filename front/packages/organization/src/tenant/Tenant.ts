export enum TenantCreationStatus {
  READY = 'READY',
  UNKNOWN = 'UNKNOWN'
}

export type Tenant = {
  name: string,
  creationStatus: TenantCreationStatus
}
