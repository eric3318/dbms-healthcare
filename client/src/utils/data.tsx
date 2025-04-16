import {
    CreateAppointmentParams,
    CreateAppointmentResponse,
    GetAppointmentsResponse,
    GetSlotsResponse,
    SlotFilter,
    AuthResponse,
    LoginParams,
    RegisterParams,
    User,
    UpdateAppointmentParams,
    AppointmentFilter,
    VerifyIdentityParams,
    AgeDistributionDto,
    SpecialtyStatsDto,
    TopDoctorsDto,
    AnalyticsFilterDto,
    DoctorCountBySpecialtyDto,
    RoleDistributionDto,
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

export async function updateAppointment(id: string, params: UpdateAppointmentParams): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to update appointment');
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function fetchAppointments(params?: AppointmentFilter): Promise<GetAppointmentsResponse | []> {
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

export async function fetchSlots(params?: SlotFilter): Promise<GetSlotsResponse> {
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
        return [];
    }
}

export async function checkAuth(): Promise<AuthResponse | null> {
    try {
        const authRes = await fetchUser();

        if (authRes && 'code' in authRes) {
            if (authRes.code === 0) {
                throw new Error();
            }

            const refreshSuccess = await refreshToken();

            if (!refreshSuccess) {
                throw new Error();
            }

            const res = await fetchUser();

            return res as AuthResponse;
        }

        return authRes as AuthResponse;
    } catch (err) {
        return null;
    }
}

export async function verifyIdentity(params: VerifyIdentityParams): Promise<boolean> {
    try {
        const res = await fetch(`${AUTH_URL}/identity`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to verify identity');
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
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

export async function fetchUsers(): Promise<User[] | []> {
    try {
        const res = await fetch(`${API_URL}/users`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        const data: User[] = await res.json();
        return data;
    } catch (err) {
        console.log('Error fetching users');
        return [];
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
            method: 'POST',
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
            credentials: 'include',
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

// Analytics API methods
export async function getAgeDistribution(): Promise<AgeDistributionDto[] | null> {
  try {
      const res = await fetch(`${API_URL}/analytics/age-distribution`, {
          credentials: 'include',
      });

      if (!res.ok) {
          throw new Error('Failed to fetch age distribution');
      }

      const data: AgeDistributionDto[] = await res.json();
      return data;
  } catch (err) {
      console.error('Error fetching age distribution:', err);
      return null;
  }
}

export async function getSpecialtyStats(
  filter: AnalyticsFilterDto
): Promise<SpecialtyStatsDto[] | null> {
  try {
      const res = await fetch(`${API_URL}/analytics/specialty-stats`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(filter),
          credentials: 'include',
      });

      if (!res.ok) {
          throw new Error('Failed to fetch specialty statistics');
      }

      const data: SpecialtyStatsDto[] = await res.json();
      return data;
  } catch (err) {
      console.error('Error fetching specialty statistics:', err);
      return null;
  }
}

export async function getTopDoctors(
  filter: AnalyticsFilterDto
): Promise<TopDoctorsDto[] | null> {
  try {
      const res = await fetch(`${API_URL}/analytics/top-doctors`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(filter),
          credentials: 'include',
      });

      if (!res.ok) {
          throw new Error('Failed to fetch top doctors');
      }

      const data: TopDoctorsDto[] = await res.json();
      return data;
  } catch (err) {
      console.error('Error fetching top doctors:', err);
      return null;
  }
}

export async function getDoctorCountBySpecialty(): Promise<DoctorCountBySpecialtyDto[] | null> {
  try {
    const res = await fetch(`${API_URL}/analytics/doctor-count-by-specialty`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch doctor count by specialty');
    }

    const data: DoctorCountBySpecialtyDto[] = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching doctor count by specialty:', err);
    return null;
  }
}

export async function getUserRoleDistribution(): Promise<RoleDistributionDto[] | null> {
  try {
    const res = await fetch(`${API_URL}/analytics/user-role-distribution`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user role distribution');
    }

    const data: RoleDistributionDto[] = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching user role distribution:', err);
    return null;
  }
}
