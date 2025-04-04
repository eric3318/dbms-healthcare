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

// Doctor related types
export type Doctor = components['schemas']['Doctor'];
export type DoctorCreateDto = components['schemas']['DoctorCreateDto'];
export type DoctorUpdateDto = components['schemas']['DoctorUpdateDto'];
