export interface DistanceAndAngleResponse {
  success: boolean;
  data: DistanceAndAngle | null;
  message?: string;
}

export interface DistanceAndAngle {
  distance: number;
  angle: number;
}
