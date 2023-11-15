export interface AccessLog {
  id: number;
  name: string;
  carBrand: string;
  carColor: string;
  carPlate: string;
  accessDaytime: string;
  doorId: number;
  visitLocation: string;
  checked: boolean;
}

export interface AccessLogWithStatus extends AccessLog {
  status: Status;
}

export enum Status {
  ON_TIME,
  NEAR_TIME,
  EXPIRED,
}
