import {
    CreateAppointmentParams,
    CreateAppointmentResponse,
    GetAppointmentsResponse,
    GetSlotsResponse,
    SlotFilter,
    AuthResponse,
    LoginParams,
    RegisterParams,
} from '../lib/types';

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export async function createAppointment(params: CreateAppointmentParams): Promise<CreateAppointmentResponse | null> {
    try {
        const res = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to create appointment');
        }

        const data: CreateAppointmentResponse = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function fetchAppointments(params?: SlotFilter): Promise<GetAppointmentsResponse | null> {
    try {
        const res = await fetch(`${API_URL}/appointments?${params ? new URLSearchParams(params) : ''}`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch appointments');
        }

        const data: GetAppointmentsResponse = await res.json();

        return data;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function fetchSlots(params?: SlotFilter): Promise<GetSlotsResponse | null> {
    try {
        const res = await fetch(`${API_URL}/slots?${params ? new URLSearchParams(params) : ''}`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch slots');
        }

        const data: GetSlotsResponse = await res.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function checkAuth(): Promise<AuthResponse | null> {
    try {
        const res = await fetch(`${AUTH_URL}/me`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to check auth');
        }

        const data: AuthResponse = await res.json();
        return data;
    } catch (err) {
        console.error('Error checking auth', err);
        return null;
    }
}

export async function login(params: LoginParams): Promise<void> {
    try {
        const res = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to login');
        }
    } catch (err) {
        console.error('Error logging in', err);
    }
}

export async function logout(): Promise<void> {
    try {
        const res = await fetch(`${AUTH_URL}/logout`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to logout');
        }
    } catch (err) {
        console.error('Error logging out', err);
    }
}

export async function register(params: RegisterParams): Promise<void> {
    try {
        const res = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to register');
        }
    } catch (err) {
        console.error('Error registering', err);
    }
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
    try {
        const res = await fetch(`${API_URL}/appointments/${appointmentId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'CANCELLED' }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to cancel appointment');
        }
    } catch (err) {
        console.error('Error canceling appointment', err);
    }
}
