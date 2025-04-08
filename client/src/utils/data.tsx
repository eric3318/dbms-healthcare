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

export async function fetchAppointments(params?: SlotFilter): Promise<GetAppointmentsResponse | []> {
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
        const authRes = await fetchUser();

        if (authRes && 'code' in authRes && authRes.code === 1) {
            const refreshSuccess = await refreshToken();

            if (!refreshSuccess) {
                throw new Error();
            }

            const res = await fetchUser();

            return res as AuthResponse;
        }

        return authRes as AuthResponse;
    } catch (err) {
        console.log('Error checking auth');
        return null;
    }
}

type AuthErrorResponse = {
    status: 'unauthorized';
    code: 0 | 1;
};

export async function fetchUser(): Promise<AuthResponse | AuthErrorResponse | null> {
    try {
        const res = await fetch(`${AUTH_URL}/me`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            const errorResponse: AuthErrorResponse = await res.json();
            return errorResponse;
        }

        const data: AuthResponse = await res.json();
        return data;
    } catch (err) {
        console.log('Error checking auth');
        return null;
    }
}

export async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${AUTH_URL}/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to refresh token');
        }
        return true;
    } catch (err) {
        console.log('Error refreshing token');
        return false;
    }
}

export async function login(params: LoginParams): Promise<boolean> {
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

        return true;
    } catch (err) {
        console.error('Error logging in', err);
        return false;
    }
}

export async function logout(): Promise<boolean> {
    try {
        const res = await fetch(`${AUTH_URL}/logout`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to logout');
        }

        return true;
    } catch (err) {
        console.error('Error logging out', err);
        return false;
    }
}

export async function register(params: RegisterParams): Promise<boolean> {
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

        return true;
    } catch (err) {
        console.error('Error registering', err);
        return false;
    }
}

export async function cancelAppointment(appointmentId: string): Promise<boolean> {
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

        return true;
    } catch (err) {
        console.error('Error canceling appointment', err);
        return false;
    }
}
