import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRate {
    pvc: bigint;
    wallMolding: bigint;
    popGypsum: bigint;
}
export interface TimeSlotAvailability {
    slot1pm: boolean;
    slot4pm: boolean;
    slot7pm: boolean;
    slot10am: boolean;
}
export interface Booking {
    id: string;
    service: string;
    propertyType: string;
    area: bigint;
    date: string;
    createdAt: Time;
    fullName: string;
    mobileNumber: string;
    location: string;
    timeSlot: string;
}
export type Time = bigint;
export interface backendInterface {
    calculateEstimate(service: string, area: bigint): Promise<bigint | null>;
    createBooking(fullName: string, mobileNumber: string, location: string, propertyType: string, service: string, date: string, timeSlot: string, area: bigint): Promise<Booking>;
    getAllBookings(): Promise<Array<Booking>>;
    getServiceRates(): Promise<ServiceRate>;
    getTimeSlotAvailability(): Promise<TimeSlotAvailability>;
    updateServiceRates(popGypsum: bigint, pvc: bigint, wallMolding: bigint): Promise<void>;
    updateTimeSlotAvailability(slot10am: boolean, slot1pm: boolean, slot4pm: boolean, slot7pm: boolean): Promise<void>;
}
