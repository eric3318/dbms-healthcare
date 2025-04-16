import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Stack, Button, Avatar, Grid, Title, Modal, List, Divider, ActionIcon, Tabs, TextInput, Textarea, NumberInput, Select } from '@mantine/core';
import { IconFileText, IconUser, IconCalendarEvent, IconNotes, IconReportMedical, IconSearch, IconPlus, IconEdit, IconEye, IconX, IconTrash } from '@tabler/icons-react';
import useAuth from '../../../../../hooks/useAuth/useAuth';

export default function Records() {
    const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    
    // 新增和编辑记录的状态
    const [newRecordModalOpen, setNewRecordModalOpen] = useState(false);
    const [editRecordModalOpen, setEditRecordModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: '',
        visitReason: '',
        patientDescription: '',
        doctorNotes: '',
        finalDiagnosis: '',
        billingAmount: 100,
        prescriptions: [] as any[],
    });

    useEffect(() => {
        getMedicalRecords();
        getPatients(); // 获取患者列表用于新建记录时选择
    }, [user]); // Re-fetch when user changes

    // 获取患者列表
    const getPatients = async () => {
        try {
            // 实际项目中应该从API获取患者列表
            // 这里使用模拟数据
            const mockPatients = [
                { id: "patient-1", name: "Alice Johnson" },
                { id: "patient-2", name: "Bob Smith" },
                { id: "patient-3", name: "Cathy Davis" },
                { id: "patient-4", name: "Dan Wilson" },
                { id: "patient-5", name: "Emma Brown" },
                { id: "patient-6", name: "Frank Miller" },
                { id: "patient-7", name: "Grace Lee" },
                { id: "patient-8", name: "Henry Garcia" },
                { id: "patient-9", name: "Iris Chen" },
                { id: "patient-10", name: "Jack Taylor" }
            ];
            setPatients(mockPatients);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    // 重置表单数据
    const resetFormData = () => {
        setFormData({
            patientId: '',
            visitReason: '',
            patientDescription: '',
            doctorNotes: '',
            finalDiagnosis: '',
            billingAmount: 100,
            prescriptions: [],
        });
    };

    // 打开新建记录模态窗口
    const handleNewRecord = () => {
        resetFormData();
        setNewRecordModalOpen(true);
    };

    // 打开编辑记录模态窗口
    const handleEditRecord = (record: any) => {
        // 提取已有记录的数据填充到表单中
        setFormData({
            patientId: record.patientId || '',
            visitReason: record.visitReason || '',
            patientDescription: record.patientDescription || '',
            doctorNotes: record.doctorNotes || '',
            finalDiagnosis: record.finalDiagnosis || '',
            billingAmount: record.billingAmount || 100,
            prescriptions: record.prescriptions || [],
        });
        setEditingRecord(record);
        setEditRecordModalOpen(true);
    };

    // 处理表单输入变化
    const handleInputChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // 添加新处方
    const addPrescription = () => {
        setFormData({
            ...formData,
            prescriptions: [
                ...formData.prescriptions,
                {
                    drugName: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    notes: ''
                }
            ]
        });
    };

    // 更新处方信息
    const updatePrescription = (index: number, field: string, value: string) => {
        const updatedPrescriptions = [...formData.prescriptions];
        updatedPrescriptions[index] = {
            ...updatedPrescriptions[index],
            [field]: value
        };
        
        setFormData({
            ...formData,
            prescriptions: updatedPrescriptions
        });
    };

    // 删除处方
    const removePrescription = (index: number) => {
        const updatedPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            prescriptions: updatedPrescriptions
        });
    };

    // 保存新记录
    const saveNewRecord = async () => {
        try {
            // 在实际应用中，这里应该调用API创建新的医疗记录
            console.log("Creating new medical record:", formData);
            
            // 创建新记录对象
            const newRecord = {
                id: `medrec-${Date.now()}`, // 生成临时ID
                patientId: formData.patientId,
                patientName: patients.find(p => p.id === formData.patientId)?.name || 'Unknown Patient',
                doctorId: user?.id || "doc-1",
                visitReason: formData.visitReason,
                patientDescription: formData.patientDescription,
                doctorNotes: formData.doctorNotes,
                finalDiagnosis: formData.finalDiagnosis,
                billingAmount: formData.billingAmount,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                prescriptions: formData.prescriptions
            };
            
            // 将新记录添加到列表中
            setMedicalRecords([newRecord, ...medicalRecords]);
            
            // 关闭模态窗口并重置表单
            setNewRecordModalOpen(false);
            resetFormData();
            
            // 这里应该显示成功消息
            alert("医疗记录创建成功！");
        } catch (error) {
            console.error("Error creating medical record:", error);
            alert("创建医疗记录时出错");
        }
    };

    // 保存编辑后的记录
    const saveEditedRecord = async () => {
        try {
            // 在实际应用中，这里应该调用API更新医疗记录
            console.log("Updating medical record:", editingRecord.id, formData);
            
            // 更新记录对象
            const updatedRecord = {
                ...editingRecord,
                visitReason: formData.visitReason,
                patientDescription: formData.patientDescription,
                doctorNotes: formData.doctorNotes,
                finalDiagnosis: formData.finalDiagnosis,
                billingAmount: formData.billingAmount,
                updatedAt: new Date().toISOString(),
                prescriptions: formData.prescriptions
            };
            
            // 更新记录列表
            setMedicalRecords(medicalRecords.map(record => 
                record.id === editingRecord.id ? updatedRecord : record
            ));
            
            // 关闭模态窗口
            setEditRecordModalOpen(false);
            setEditingRecord(null);
            
            // 这里应该显示成功消息
            alert("医疗记录更新成功！");
        } catch (error) {
            console.error("Error updating medical record:", error);
            alert("更新医疗记录时出错");
        }
    };

    const getMockMedicalRecords = () => {
        return [
            {
                id: "medrec-1",
                patientId: "patient-1",
                patientName: "Alice Johnson",
                doctorId: user?.id || "doc-1",
                visitReason: "Chest pain",
                patientDescription: "Severe pain in lower abdomen",
                doctorNotes: "Prescribed medication and advised rest",
                finalDiagnosis: "Sinusitis",
                billingAmount: 150.0,
                createdAt: "2025-04-01T09:00:00Z",
                updatedAt: "2025-04-01T09:30:00Z",
                prescriptions: [
                    {
                        drugName: "Amoxicillin",
                        dosage: "500mg",
                        frequency: "Twice daily",
                        duration: "7 days",
                        notes: "Take with food"
                    }
                ]
            },
            {
                id: "medrec-2",
                patientId: "patient-2",
                patientName: "Bob Smith",
                doctorId: user?.id || "doc-1",
                visitReason: "Follow-up after blood test",
                patientDescription: "Patient reports improvement in symptoms",
                doctorNotes: "Results show normal levels. Continue current medication regimen.",
                finalDiagnosis: "Upper respiratory infection - improving",
                billingAmount: 125.0,
                createdAt: "2025-03-28T10:00:00Z",
                updatedAt: "2025-03-28T10:30:00Z",
                prescriptions: [
                    {
                        drugName: "Ibuprofen",
                        dosage: "200mg",
                        frequency: "Every 4-6 hours as needed",
                        duration: "3 days",
                        notes: "For pain relief"
                    }
                ]
            },
            {
                id: "medrec-3",
                patientId: "patient-3",
                patientName: "Cathy Davis",
                doctorId: user?.id || "doc-1",
                visitReason: "Allergy symptoms",
                patientDescription: "Itchy skin rash on arms and legs",
                doctorNotes: "Skin appears inflamed. Possible contact dermatitis. Recommended hypoallergenic products.",
                finalDiagnosis: "Contact dermatitis",
                billingAmount: 100.0,
                createdAt: "2025-04-10T11:00:00Z",
                updatedAt: "2025-04-10T11:30:00Z",
                prescriptions: [
                    {
                        drugName: "Cetirizine",
                        dosage: "10mg",
                        frequency: "Once daily",
                        duration: "5 days",
                        notes: "For allergy relief"
                    },
                    {
                        drugName: "Hydrocortisone cream",
                        dosage: "Apply thin layer",
                        frequency: "Twice daily",
                        duration: "7 days",
                        notes: "For affected areas only"
                    }
                ]
            },
            {
                id: "medrec-4",
                patientId: "patient-5",
                patientName: "Emma Brown",
                doctorId: user?.id || "doc-1",
                visitReason: "Routine checkup",
                patientDescription: "No major complaints",
                doctorNotes: "All vitals normal. Recommended annual blood work.",
                finalDiagnosis: "Healthy",
                billingAmount: 125.0,
                createdAt: "2025-04-15T12:00:00Z",
                updatedAt: "2025-04-15T12:30:00Z",
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
                    const doctorId = user.sub || user.id;
                    console.log('Attempting to fetch medical records for doctor:', doctorId);
                    
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                    const endpoint = `${API_URL}/medical-records/by-doctor/${encodeURIComponent(doctorId)}`;
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
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Filter records based on search query and active tab
    const filteredRecords = medicalRecords.filter(record => {
        const matchesSearch = 
            record.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.finalDiagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.visitReason?.toLowerCase().includes(searchQuery.toLowerCase());
            
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'recent') {
            // Show records from the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return matchesSearch && new Date(record.createdAt) >= sevenDaysAgo;
        }
        return matchesSearch;
    });

    // Sort records by date (newest first)
    const sortedRecords = [...filteredRecords].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (loading) {
        return <Text>Loading medical records...</Text>;
    }

    return (
        <div>
            <Group justify="space-between" mb="md">
                <Title order={2}>Patient Medical Records</Title>
                <Group>
                    {error && (
                        <Badge color="red" size="lg" mr="sm">API ERROR - USING MOCK DATA</Badge>
                    )}
                    <div style={{ width: '250px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search by patient or diagnosis..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{
                                    padding: '8px 12px 8px 36px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    width: '100%',
                                    fontSize: '14px'
                                }}
                            />
                            <div style={{ 
                                position: 'absolute', 
                                left: '10px', 
                                top: '50%', 
                                transform: 'translateY(-50%)'
                            }}>
                                <IconSearch size={18} color="#888" />
                            </div>
                        </div>
                    </div>
                    <Button onClick={getMedicalRecords} variant="light">Refresh</Button>
                    <Button 
                        leftSection={<IconPlus size={16} />}
                        color="blue"
                        onClick={handleNewRecord}
                    >
                        New Record
                    </Button>
                </Group>
            </Group>
            
            <Tabs value={activeTab} onChange={setActiveTab as any} mb="md">
                <Tabs.List>
                    <Tabs.Tab value="all">All Records</Tabs.Tab>
                    <Tabs.Tab value="recent">Recent (7 days)</Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {sortedRecords.length === 0 ? (
                <Text size="lg" ta="center" mt="xl">
                    {searchQuery ? "No records match your search" : "No medical records found"}
                </Text>
            ) : (
                <Grid>
                    {sortedRecords.map(record => (
                        <Grid.Col span={6} key={record.id}>
                            <Card shadow="sm" padding="md" radius="md" withBorder>
                                <Group justify="space-between" mb="xs">
                                    <Group>
                                        <Avatar radius="xl" color="blue">
                                            {record.patientName?.charAt(0) || 'P'}
                                        </Avatar>
                                        <div>
                                            <Text fw={700}>{record.patientName || 'Unknown Patient'}</Text>
                                            <Text size="xs" c="dimmed">Visit: {formatDate(record.createdAt)}</Text>
                                        </div>
                                    </Group>
                                </Group>
                                
                                <Group gap="xs" mb="xs">
                                    <IconFileText size={16} />
                                    <Text fw={500}>Reason:</Text>
                                    <Text>{record.visitReason}</Text>
                                </Group>
                                
                                <Group gap="xs" mb="xs">
                                    <IconReportMedical size={16} />
                                    <Text fw={500}>Diagnosis:</Text>
                                    <Text>{record.finalDiagnosis}</Text>
                                </Group>
                                
                                {record.prescriptions && record.prescriptions.length > 0 && (
                                    <Group gap="xs" mb="xs">
                                        <Text fw={500}>Prescriptions:</Text>
                                        <Text>{record.prescriptions.length} item(s)</Text>
                                    </Group>
                                )}
                                
                                <Group mt="md" justify="flex-end">
                                    <Button 
                                        variant="subtle" 
                                        rightSection={<IconEye size={16} />}
                                        onClick={() => handleViewDetails(record)}
                                    >
                                        View Details
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        rightSection={<IconEdit size={16} />}
                                        onClick={() => handleEditRecord(record)}
                                    >
                                        Edit Record
                                    </Button>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
            
            {/* 详情模态窗口 */}
            <Modal
                opened={detailsModalOpen}
                onClose={closeDetailsModal}
                title={<Title order={3}>Medical Record Details</Title>}
                size="lg"
            >
                {selectedRecord && (
                    <Stack>
                        <Group align="flex-start">
                            <Avatar size="lg" radius="xl" color="blue">
                                {selectedRecord.patientName?.charAt(0) || 'P'}
                            </Avatar>
                            <div>
                                <Text size="xl" fw={700}>{selectedRecord.patientName || 'Unknown Patient'}</Text>
                                <Text size="sm" c="dimmed">Patient ID: {selectedRecord.patientId}</Text>
                                <Text size="sm" c="dimmed">Visit Date: {formatDate(selectedRecord.createdAt)}</Text>
                            </div>
                        </Group>
                        
                        <Divider my="md" />
                        
                        <Group align="flex-start">
                            <IconFileText size={20} />
                            <div>
                                <Text fw={700}>Visit Reason</Text>
                                <Text>{selectedRecord.visitReason}</Text>
                            </div>
                        </Group>
                        
                        <Group align="flex-start">
                            <IconUser size={20} />
                            <div>
                                <Text fw={700}>Patient Description</Text>
                                <Text>{selectedRecord.patientDescription}</Text>
                            </div>
                        </Group>
                        
                        <Group align="flex-start">
                            <IconNotes size={20} />
                            <div>
                                <Text fw={700}>Doctor's Notes</Text>
                                <Text>{selectedRecord.doctorNotes}</Text>
                            </div>
                        </Group>
                        
                        <Group align="flex-start">
                            <IconReportMedical size={20} />
                            <div>
                                <Text fw={700}>Final Diagnosis</Text>
                                <Text>{selectedRecord.finalDiagnosis}</Text>
                            </div>
                        </Group>
                        
                        <Divider my="md" />
                        
                        <Text fw={700}>Prescriptions</Text>
                        {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 ? (
                            selectedRecord.prescriptions.map((prescription: any, index: number) => (
                                <Card key={index} withBorder p="sm" radius="md">
                                    <Text fw={700}>{prescription.drugName}</Text>
                                    <Group>
                                        <Text size="sm">Dosage: {prescription.dosage}</Text>
                                        <Text size="sm">Frequency: {prescription.frequency}</Text>
                                        <Text size="sm">Duration: {prescription.duration}</Text>
                                    </Group>
                                    {prescription.notes && (
                                        <Text size="sm" c="dimmed" mt="xs">Note: {prescription.notes}</Text>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Text c="dimmed">No prescriptions for this visit</Text>
                        )}
                        
                        <Divider my="md" />
                        
                        <Group justify="space-between">
                            <div>
                                <Text fw={700}>Billing Amount</Text>
                                <Text>${selectedRecord.billingAmount?.toFixed(2)}</Text>
                            </div>
                            <Button onClick={closeDetailsModal}>Close</Button>
                        </Group>
                    </Stack>
                )}
            </Modal>

            {/* 新建记录模态窗口 */}
            <Modal
                opened={newRecordModalOpen}
                onClose={() => setNewRecordModalOpen(false)}
                title={<Title order={3}>Create New Medical Record</Title>}
                size="lg"
            >
                <Stack>
                    <Select
                        label="Patient"
                        placeholder="Select patient"
                        data={patients.map(p => ({ value: p.id, label: p.name }))}
                        value={formData.patientId}
                        onChange={(value) => handleInputChange('patientId', value)}
                        required
                        searchable
                    />
                    
                    <TextInput
                        label="Visit Reason"
                        placeholder="E.g., Routine checkup, Fever, etc."
                        value={formData.visitReason}
                        onChange={(e) => handleInputChange('visitReason', e.target.value)}
                        required
                    />
                    
                    <Textarea
                        label="Patient Description"
                        placeholder="Patient's description of symptoms or concerns"
                        minRows={2}
                        value={formData.patientDescription}
                        onChange={(e) => handleInputChange('patientDescription', e.target.value)}
                        required
                    />
                    
                    <Textarea
                        label="Doctor Notes"
                        placeholder="Medical observations and treatment notes"
                        minRows={3}
                        value={formData.doctorNotes}
                        onChange={(e) => handleInputChange('doctorNotes', e.target.value)}
                        required
                    />
                    
                    <TextInput
                        label="Final Diagnosis"
                        placeholder="E.g., Common Cold, Hypertension, etc."
                        value={formData.finalDiagnosis}
                        onChange={(e) => handleInputChange('finalDiagnosis', e.target.value)}
                        required
                    />
                    
                    <NumberInput
                        label="Billing Amount ($)"
                        placeholder="Enter amount"
                        value={formData.billingAmount}
                        onChange={(value) => handleInputChange('billingAmount', value)}
                        min={0}
                        required
                        decimalScale={2}
                        fixedDecimalScale
                    />
                    
                    <Divider my="sm" label="Prescriptions" labelPosition="center" />
                    
                    {formData.prescriptions.map((prescription, index) => (
                        <Card key={index} withBorder shadow="xs" mb="sm" p="sm">
                            <Group position="apart" mb="xs">
                                <Text fw={500}>Prescription #{index + 1}</Text>
                                <ActionIcon color="red" onClick={() => removePrescription(index)}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                            <Stack spacing="xs">
                                <TextInput
                                    label="Drug Name"
                                    placeholder="Medication name"
                                    value={prescription.drugName}
                                    onChange={(e) => updatePrescription(index, 'drugName', e.target.value)}
                                    required
                                />
                                <Group grow>
                                    <TextInput
                                        label="Dosage"
                                        placeholder="E.g., 500mg"
                                        value={prescription.dosage}
                                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                                        required
                                    />
                                    <TextInput
                                        label="Frequency"
                                        placeholder="E.g., Once daily"
                                        value={prescription.frequency}
                                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                                        required
                                    />
                                </Group>
                                <Group grow>
                                    <TextInput
                                        label="Duration"
                                        placeholder="E.g., 7 days"
                                        value={prescription.duration}
                                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                                        required
                                    />
                                    <TextInput
                                        label="Notes"
                                        placeholder="Additional instructions"
                                        value={prescription.notes}
                                        onChange={(e) => updatePrescription(index, 'notes', e.target.value)}
                                    />
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                    
                    <Button 
                        leftSection={<IconPlus size={16} />}
                        variant="outline" 
                        onClick={addPrescription}
                    >
                        Add Prescription
                    </Button>
                    
                    <Group position="right" mt="lg">
                        <Button variant="outline" onClick={() => setNewRecordModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="blue" onClick={saveNewRecord}>
                            Create Record
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* 编辑记录模态窗口 */}
            <Modal
                opened={editRecordModalOpen}
                onClose={() => setEditRecordModalOpen(false)}
                title={<Title order={3}>Edit Medical Record</Title>}
                size="lg"
            >
                <Stack>
                    <Group>
                        <Text fw={500}>Patient:</Text>
                        <Text>{editingRecord?.patientName || 'Unknown Patient'}</Text>
                    </Group>
                    
                    <TextInput
                        label="Visit Reason"
                        value={formData.visitReason}
                        onChange={(e) => handleInputChange('visitReason', e.target.value)}
                        required
                    />
                    
                    <Textarea
                        label="Patient Description"
                        minRows={2}
                        value={formData.patientDescription}
                        onChange={(e) => handleInputChange('patientDescription', e.target.value)}
                        required
                    />
                    
                    <Textarea
                        label="Doctor Notes"
                        minRows={3}
                        value={formData.doctorNotes}
                        onChange={(e) => handleInputChange('doctorNotes', e.target.value)}
                        required
                    />
                    
                    <TextInput
                        label="Final Diagnosis"
                        value={formData.finalDiagnosis}
                        onChange={(e) => handleInputChange('finalDiagnosis', e.target.value)}
                        required
                    />
                    
                    <NumberInput
                        label="Billing Amount ($)"
                        value={formData.billingAmount}
                        onChange={(value) => handleInputChange('billingAmount', value)}
                        min={0}
                        required
                        decimalScale={2}
                        fixedDecimalScale
                    />
                    
                    <Divider my="sm" label="Prescriptions" labelPosition="center" />
                    
                    {formData.prescriptions.map((prescription, index) => (
                        <Card key={index} withBorder shadow="xs" mb="sm" p="sm">
                            <Group position="apart" mb="xs">
                                <Text fw={500}>Prescription #{index + 1}</Text>
                                <ActionIcon color="red" onClick={() => removePrescription(index)}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                            <Stack spacing="xs">
                                <TextInput
                                    label="Drug Name"
                                    value={prescription.drugName}
                                    onChange={(e) => updatePrescription(index, 'drugName', e.target.value)}
                                    required
                                />
                                <Group grow>
                                    <TextInput
                                        label="Dosage"
                                        value={prescription.dosage}
                                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                                        required
                                    />
                                    <TextInput
                                        label="Frequency"
                                        value={prescription.frequency}
                                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                                        required
                                    />
                                </Group>
                                <Group grow>
                                    <TextInput
                                        label="Duration"
                                        value={prescription.duration}
                                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                                        required
                                    />
                                    <TextInput
                                        label="Notes"
                                        value={prescription.notes}
                                        onChange={(e) => updatePrescription(index, 'notes', e.target.value)}
                                    />
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                    
                    <Button 
                        leftSection={<IconPlus size={16} />}
                        variant="outline" 
                        onClick={addPrescription}
                    >
                        Add Prescription
                    </Button>
                    
                    <Group position="right" mt="lg">
                        <Button variant="outline" onClick={() => setEditRecordModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="blue" onClick={saveEditedRecord}>
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
}
