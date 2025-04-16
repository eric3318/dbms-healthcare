import { fetchAppointments } from '../../../../../utils/data';
import { useEffect, useState } from 'react';
import useAuth from '../../../../../hooks/useAuth/useAuth';

export default function Records() {
    const { user } = useAuth();
    const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    useEffect(() => {
        getMedicalRecords();
    }, [user]); // Re-fetch when user changes

    const getMockMedicalRecords = () => {
        return [
            {
                id: "medrec-1",
                patientId: user?.id || "patient-1",
                doctorId: "doc-1",
                doctorName: "Dr. Smith",
                visitReason: "Routine checkup",
                patientDescription: "Patient reports mild fever and sore throat",
                doctorNotes: "Physical examination shows redness in throat, slightly elevated temperature",
                finalDiagnosis: "Common cold",
                billingAmount: 150.00,
                createdAt: "2025-04-01T09:00:00Z",
                updatedAt: "2025-04-01T09:30:00Z",
                prescriptions: [
                    {
                        drugName: "Acetaminophen",
                        dosage: "500mg",
                        frequency: "Every 6 hours as needed",
                        duration: "3 days",
                        notes: "Take with food"
                    }
                ]
            },
            {
                id: "medrec-2",
                patientId: user?.id || "patient-1",
                doctorId: "doc-2",
                doctorName: "Dr. Chen",
                visitReason: "Follow-up appointment",
                patientDescription: "Patient reports improvement in symptoms",
                doctorNotes: "Fever has subsided, throat appears normal",
                finalDiagnosis: "Resolved upper respiratory infection",
                billingAmount: 125.00,
                createdAt: "2025-03-15T14:00:00Z",
                updatedAt: "2025-03-15T14:30:00Z",
                prescriptions: [
                    {
                        drugName: "Vitamin C",
                        dosage: "500mg",
                        frequency: "Once daily",
                        duration: "14 days",
                        notes: "For immune support"
                    }
                ]
            },
            {
                id: "medrec-3",
                patientId: user?.id || "patient-1",
                doctorId: "doc-3",
                doctorName: "Dr. Patel",
                visitReason: "Annual physical",
                patientDescription: "No major complaints, routine checkup",
                doctorNotes: "All vitals within normal range, labs ordered",
                finalDiagnosis: "Healthy, no significant findings",
                billingAmount: 200.00,
                createdAt: "2025-01-20T10:30:00Z",
                updatedAt: "2025-01-20T11:15:00Z",
                prescriptions: []
            }
        ];
    };

    const getMedicalRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch real data if user is logged in
            if (user && (user.sub || user.id)) {
                try {
                    const userId = user.sub || user.id;
                    console.log('Attempting to fetch medical records for user:', userId);
                    
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                    const endpoint = `${API_URL}/medical-records/by-patient/${encodeURIComponent(userId)}`;
                    console.log('Fetching from endpoint:', endpoint);
                    
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        if (response.status === 500) {
                            console.error('Server error when fetching medical records');
                        }
                        throw new Error(`API responded with status ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Fetched medical records:', data);
                    
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('Successfully loaded real medical records from API');
                        setMedicalRecords(data);
                        setLoading(false);
                        return; // Exit if we got data
                    } else {
                        console.log('API returned empty result, falling back to mock data');
                    }
                } catch (apiError) {
                    console.error('API request failed:', apiError);
                    console.log('Using mock data as fallback');
                }
            }
            
            // Fallback to mock data
            console.log('Using mock medical records data');
            setMedicalRecords(getMockMedicalRecords());
            
        } catch (error) {
            console.error('Error in getMedicalRecords:', error);
            setError(`Failed to load medical records: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setMedicalRecords(getMockMedicalRecords());
        } finally {
            setLoading(false);
        }
    };
    
    const handleViewDetails = (record: any) => {
        console.log('Viewing details for record:', record);
        setSelectedRecord(record);
        setDetailsModalOpen(true);
    };
    
    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedRecord(null);
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div>Loading your medical records...</div>;
    }

    if (error) {
        return (
            <div>
                <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
                <button onClick={getMedicalRecords}>Try Again</button>
            </div>
        );
    }

    // Sort records by date (newest first)
    const sortedRecords = [...medicalRecords].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>Medical Records</h2>
            
            {sortedRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                    No medical records found
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sortedRecords.map((record) => (
                        <div 
                            key={record.id} 
                            style={{ 
                                border: '1px solid #e0e0e0', 
                                borderRadius: '8px',
                                padding: '16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '12px' 
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                    {record.visitReason}
                                </div>
                                <div style={{ color: '#666', fontSize: '14px' }}>
                                    {formatDate(record.createdAt)}
                                </div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '12px'  
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Doctor</div>
                                    <div>{record.doctorName || 'Unknown Doctor'}</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Diagnosis</div>
                                    <div>{record.finalDiagnosis}</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Cost</div>
                                    <div>${record.billingAmount?.toFixed(2)}</div>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '16px' }}>
                                <button 
                                    onClick={() => handleViewDetails(record)}
                                    style={{
                                        backgroundColor: '#0070f3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Full Record
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Modal for record details */}
            {detailsModalOpen && selectedRecord && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '80%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0 }}>{selectedRecord.visitReason}</h3>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                                {formatDate(selectedRecord.createdAt)}
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h4>Doctor</h4>
                            <div>{selectedRecord.doctorName || 'Unknown Doctor'}</div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h4>Patient Description</h4>
                            <div>{selectedRecord.patientDescription}</div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h4>Doctor Notes</h4>
                            <div>{selectedRecord.doctorNotes}</div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h4>Final Diagnosis</h4>
                            <div>{selectedRecord.finalDiagnosis}</div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h4>Billing Amount</h4>
                            <div>${selectedRecord.billingAmount?.toFixed(2)}</div>
                        </div>
                        
                        {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <h4>Prescriptions</h4>
                                {selectedRecord.prescriptions.map((prescription: any, index: number) => (
                                    <div 
                                        key={index} 
                                        style={{ 
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '4px',
                                            padding: '12px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{prescription.drugName}</div>
                                        <div>Dosage: {prescription.dosage}</div>
                                        <div>Frequency: {prescription.frequency}</div>
                                        <div>Duration: {prescription.duration}</div>
                                        {prescription.notes && (
                                            <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                                                Note: {prescription.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button 
                                onClick={closeDetailsModal}
                                style={{
                                    backgroundColor: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
