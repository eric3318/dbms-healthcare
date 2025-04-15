import { components } from './api';

export type Slot = components['schemas']['Slot'];
export type SlotFilter = components['schemas']['SlotFilter'];
export type Appointment = components['schemas']['Appointment'];
export type AppointmentFilter = components['schemas']['AppointmentFilter'];
export type CreateAppointmentParams = components['schemas']['AppointmentCreateDto'];
export type CreateAppointmentResponse = components['schemas']['Appointment'];
export type UpdateAppointmentParams = components['schemas']['AppointmentUpdateDto'];
export type GetAppointmentsResponse = components['schemas']['Appointment'][];
export type GetSlotsResponse = components['schemas']['Slot'][];
export type AuthResponse = components['schemas']['User'];
export type LoginParams = components['schemas']['UserLoginDto'];
export type User = AuthResponse;
export type RegisterParams = components['schemas']['UserCreateDto'];

export type VerifyIdentityParams = components['schemas']['IdentityCheckDto'];

export type Patient = components['schemas']['Patient'];
export type Requisition = components['schemas']['Requisition'];

export type PatientCreateDto = components['schemas']['PatientCreateDto'];
export type PatientUpdateDto = components['schemas']['PatientUpdateDto'];
export type RequisitionCreateDto = components['schemas']['RequisitionCreateDto'];
export type RequisitionUpdateDto = components['schemas']['RequisitionUpdateDto'];
export type RequisitionResult = components['schemas']['RequisitionResult'];
export type AppointmentUpdateDto = components['schemas']['AppointmentUpdateDto'];

// Doctor related types
export type Doctor = components['schemas']['Doctor'];
export type DoctorCreateDto = components['schemas']['DoctorCreateDto'];
export type DoctorUpdateDto = components['schemas']['DoctorUpdateDto'];

export type AgeDistributionDto = components['schemas']['AgeDistributionDto'];
export type SpecialtyStatsDto = components['schemas']['SpecialtyStatsDto'];
export type TopDoctorsDto = components['schemas']['TopDoctorsDto'];
export type AnalyticsFilterDto = components['schemas']['AnalyticsFilterDto'];