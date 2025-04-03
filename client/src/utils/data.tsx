const API_URL = import.meta.env.VITE_API_URL;

export async function createAppointment(slotId: string, patientId: string) {
    try {
        const res = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            body: JSON.stringify({
                slotId,
                patientId,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to create appointment');
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getSlots() {
    try {
        const res = await fetch(`${API_URL}/slots`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch slots');
        }

        const data = await res.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
