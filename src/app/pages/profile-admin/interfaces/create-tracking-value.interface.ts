export interface CreateTrackingValueInterface {
    userId: number;
    trackingValueName: string;
    minLimit: number;
    maxLimit: number;
    currentValue: number;
}
