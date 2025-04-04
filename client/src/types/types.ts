import { components } from './api';

export type Slot = components['schemas']['Slot'];
export type SlotFilter = components['schemas']['SlotFilter'];
export type CreateAppointmentParams = components['schemas']['AppointmentCreateDto'];
export type CreateAppointmentResponse = components['schemas']['Slot'];
export type GetAppointmentsResponse = components['schemas']['Slot'][];
export type GetSlotsResponse = components['schemas']['Slot'][];
export type AuthResponse = components['schemas']['User'];
export type LoginParams = components['schemas']['UserLoginDto'];
export type User = AuthResponse;
export type RegisterParams = components['schemas']['UserCreateDto'];

export type Patient = components['schemas']['Patient'];
export type Requisition = components['schemas']['Requisition'];

export type PatientCreateDto = components['schemas']['PatientCreateDto'];
export type PatientUpdateDto = components['schemas']['PatientUpdateDto'];
export type RequisitionCreateDto = components['schemas']['RequisitionCreateDto'];
export type RequisitionUpdateDto = components['schemas']['RequisitionUpdateDto'];
export type RequisitionResult = components['schemas']['RequisitionResult'];
export type AppointmentUpdateDto = components['schemas']['AppointmentUpdateDto'];

