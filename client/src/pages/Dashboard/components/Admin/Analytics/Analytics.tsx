import React, { useState, useEffect } from 'react';
import { 
  Select, 
  Title, 
  Grid, 
  Paper, 
  Text, 
  Group, 
  Table, 
  Loader,
  Center 
} from '@mantine/core';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAgeDistribution, getTopDoctors, getSpecialtyStats, getDoctorCountBySpecialty, getUserRoleDistribution } from '../../../../../utils/data';
import { 
  AgeDistributionDto, 
  TopDoctorsDto, 
  SpecialtyStatsDto,
  DoctorCountBySpecialtyDto,
  RoleDistributionDto
} from '../../../../../lib/types';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics = () => {
  // State for filters and data
  const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + '');
  const [year, setYear] = useState<string>(new Date().getFullYear() + '');
  const [ageDistribution, setAgeDistribution] = useState<AgeDistributionDto[] | null>(null);
  const [topDoctors, setTopDoctors] = useState<TopDoctorsDto[] | null>(null);
  const [specialtyStats, setSpecialtyStats] = useState<SpecialtyStatsDto[] | null>(null);
  const [doctorCountBySpecialty, setDoctorCountBySpecialty] = useState<DoctorCountBySpecialtyDto[] | null>(null);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistributionDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Generate month options
  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate year options (last 3 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() }
  ];

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching analytics data with filter:', { month, year });
        
        // Fetch age distribution data (no time filter)
        const ageData = await getAgeDistribution();
        console.log('Age distribution data:', ageData);
        setAgeDistribution(ageData);
        
        // Fetch data with time filters
        const filter = { month, year: parseInt(year) };
        const doctorsData = await getTopDoctors(filter);
        console.log('Top doctors data:', doctorsData);
        setTopDoctors(doctorsData);
        
        const specialtiesData = await getSpecialtyStats(filter);
        console.log('Specialty statistics data:', specialtiesData);
        setSpecialtyStats(specialtiesData);

        const doctorCount = await getDoctorCountBySpecialty();
        setDoctorCountBySpecialty(doctorCount);

        const roleData = await getUserRoleDistribution();
        setRoleDistribution(roleData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [month, year]);

  // Format data for age distribution pie chart
  const formatAgeData = (data: AgeDistributionDto[] | null) => {
    if (!data) return [];
    return data.map(item => ({
      name: item.ageGroup,
      value: item.patientCount
    }));
  };

  // Render pie chart for age distribution
  const renderAgeDistributionChart = () => {
    if (!ageDistribution) return <Center><Loader /></Center>;
    
    const data = formatAgeData(ageDistribution);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} patients`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render bar chart for specialty statistics
  const renderSpecialtyChart = () => {
    if (!specialtyStats) return <Center><Loader /></Center>;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={specialtyStats}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="specialty" 
            angle={-45} 
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
          <Legend />
          <Bar dataKey="appointmentCount" name="Appointment Count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render table for top doctors
  const renderTopDoctorsTable = () => {
    if (!topDoctors) return <Center><Loader /></Center>;
    
    return (
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Doctor</Table.Th>
            <Table.Th>Specialization</Table.Th>
            <Table.Th>Appointments</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {topDoctors.map((doctor, index) => (
            <Table.Tr key={doctor.doctorId}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{doctor.doctorName}</Table.Td>
              <Table.Td>{doctor.specialization}</Table.Td>
              <Table.Td>{doctor.appointmentCount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  };

  const renderDoctorCountChart = () => {
    if (!doctorCountBySpecialty) return <Center><Loader /></Center>;
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={doctorCountBySpecialty}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="specialty" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="doctorCount" name="Doctors" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  const renderRoleDistributionChart = () => {
    if (!roleDistribution) return <Center><Loader /></Center>;
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={roleDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            nameKey="role"
          >
            {roleDistribution.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="lg">Healthcare Analytics Dashboard</Title>
      
      {/* Time period filter */}
      <Paper shadow="xs" p="md" mb="xl">
        <Group>
          <Text fw={500}>Time Period:</Text>
          <Select
            placeholder="Month"
            data={monthOptions}
            value={month}
            onChange={(value) => setMonth(value || '1')}
            style={{ width: 150 }}
          />
          <Select
            placeholder="Year"
            data={yearOptions}
            value={year}
            onChange={(value) => setYear(value || currentYear.toString())}
            style={{ width: 150 }}
          />
        </Group>
      </Paper>
      
      {error && (
        <Paper p="md" mb="lg" bg="red.1">
          <Text c="red">{error}</Text>
        </Paper>
      )}
      
      {loading ? (
        <Center h={400}>
          <Loader size="xl" />
        </Center>
      ) : (
        <Grid>
          {/* Top Doctors Section - Full width */}
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" mb="lg">
              <Title order={3} mb="md">Top 5 Doctors</Title>
              {renderTopDoctorsTable()}
            </Paper>
          </Grid.Col>
          
          {/* Specialty Stats Section - Full width */}
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" mb="lg">
              <Title order={3} mb="md">Most Popular Specialties</Title>
              {renderSpecialtyChart()}
            </Paper>
          </Grid.Col>
          
          {/* Age Distribution Section - Full width */}
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" mb="lg">
              <Title order={3} mb="md">Patient Age Distribution</Title>
              {renderAgeDistributionChart()}
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" mb="lg">
              <Title order={3} mb="md">Doctor Count by Specialty</Title>
              {renderDoctorCountChart()}
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper shadow="xs" p="md" mb="lg">
              <Title order={3} mb="md">User Role Distribution</Title>
              {renderRoleDistributionChart()}
            </Paper>
          </Grid.Col>
        </Grid>
      )}
    </div>
  );
};

export default Analytics;

// import { useState } from 'react';
// import { Tabs, Text, Box, Card, Textarea, Button, Code, Alert, Divider, Title, Group, Paper } from '@mantine/core';
// import { IconChartBar, IconDatabase, IconCheck, IconX, IconRun, IconArrowBarToDown, IconClock, IconDatabaseImport } from '@tabler/icons-react';

// // API URL from environment variables
// const API_URL = import.meta.env.VITE_API_URL;

// // Doctor Availability Analysis - Based on Slots
// const doctorAvailabilityAggregation = `[
//   {
//     "$match": {
//       "status": "AVAILABLE"
//     }
//   },
//   {
//     "$lookup": {
//       "from": "doctors",
//       "let": { "doctorId": "$doctor_id" },
//       "pipeline": [
//         {
//           "$match": {
//             "$expr": { 
//               "$eq": ["$_id", { "$toObjectId": "$$doctorId" }]
//             }
//           }
//         }
//       ],
//       "as": "doctorInfo"
//     }
//   },
//   {
//     "$group": {
//       "_id": "$doctor_id",
//       "doctorInfo": { "$first": "$doctorInfo" },
//       "slotCount": { "$sum": 1 },
//       "totalMinutes": {
//         "$sum": {
//           "$divide": [
//             {
//               "$subtract": [
//                 "$end_time",
//                 "$start_time"
//               ]
//             },
//             60000
//           ]
//         }
//       }
//     }
//   },
//   {
//     "$project": {
//       "_id": 0,
//       "doctorId": "$_id",
//       "doctorName": {
//         "$cond": {
//           "if": { "$gt": [{ "$size": "$doctorInfo" }, 0] },
//           "then": { "$arrayElemAt": ["$doctorInfo.name", 0] },
//           "else": "Unknown Doctor"
//         }
//       },
//       "specialization": {
//         "$cond": {
//           "if": { "$gt": [{ "$size": "$doctorInfo" }, 0] },
//           "then": { "$arrayElemAt": ["$doctorInfo.specialization", 0] },
//           "else": "Unknown Specialization"
//         }
//       },
//       "slotCount": 1,
//       "totalFreeMinutes": { "$round": ["$totalMinutes", 0] },
//       "totalFreeHours": { 
//         "$round": [
//           { "$divide": ["$totalMinutes", 60] },
//           1
//         ]
//       }
//     }
//   },
//   {
//     "$sort": { "totalFreeMinutes": -1 }
//   }
// ]`;

// // Task 6: Query Optimization - Critical Index Creation Example
// const criticalIndexesScript = `{
//   "slots_compound": {
//     "collection": "slots",
//     "operation": "createIndex",
//     "keys": { 
//       "doctor_id": 1,
//       "start_time": 1,
//       "end_time": 1,
//       "status": 1
//     },
//     "options": { 
//       "name": "doctor_availability_index_v2",
//       "background": true,
//       "description": "Optimizes doctor availability queries by indexing doctor_id, time slots and status"
//     }
//   }
// }`;

// export default function Analytics() {
//     const [availabilityResult, setAvailabilityResult] = useState<string | null>(null);
//     const [indexResult, setIndexResult] = useState<string | null>(null);
//     const [availabilitySuccess, setAvailabilitySuccess] = useState<boolean | null>(null);
//     const [indexSuccess, setIndexSuccess] = useState<boolean | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false);

//     // Execute Doctor Availability Analysis
//     const executeAvailabilityAnalysis = async () => {
//         try {
//             setAvailabilityLoading(true);
            
//             console.log('Sending pipeline:', doctorAvailabilityAggregation); // Debug log
            
//             // Call backend API to execute aggregation query
//             const response = await fetch(`${API_URL}/analytics/aggregate`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     collection: 'slots',
//                     pipeline: doctorAvailabilityAggregation
//                 }),
//                 credentials: 'include'
//             });
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Server response error: ${response.status} - ${errorText}`);
//             }
            
//             const data = await response.json();
//             console.log('Response data:', data); // Debug log
            
//             if (Array.isArray(data) && data.length === 0) {
//                 setAvailabilityResult(JSON.stringify([{
//                     message: "No slots found in the database. Please ensure the slots collection is populated."
//                 }], null, 2));
//             } else {
//                 setAvailabilityResult(JSON.stringify(data, null, 2));
//             }
//             setAvailabilitySuccess(true);
//         } catch (error) {
//             console.error("Error executing availability analysis:", error);
//             setAvailabilityResult(error instanceof Error ? error.message : "Unknown error executing availability analysis");
//             setAvailabilitySuccess(false);
//         } finally {
//             setAvailabilityLoading(false);
//         }
//     };

//     // Execute Task 6: Create Critical Indexes
//     const createCriticalIndexes = async () => {
//         try {
//             setLoading(true);
            
//             // Parse index script to ensure correct format
//             const indexData = JSON.parse(criticalIndexesScript);
            
//             // Call backend API to create indexes
//             const response = await fetch(`${API_URL}/analytics/indexes`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     commands: JSON.stringify(indexData)
//                 }),
//                 credentials: 'include'
//             });
            
//             // Check response status
//             if (!response.ok) {
//                 throw new Error(`Server response error: ${response.status} ${response.statusText}`);
//             }
            
//             // Safely parse JSON response
//             const text = await response.text();
//             let data;
            
//             try {
//                 // Only attempt to parse when response is not empty
//                 data = text.trim() ? JSON.parse(text) : { message: "Server returned an empty response" };
//             } catch (parseError: unknown) {
//                 console.error("JSON parsing error:", parseError, "Original response:", text);
//                 throw new Error(`Unable to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
//             }
            
//             setIndexResult(JSON.stringify(data, null, 2));
//             setIndexSuccess(true);
//         } catch (error) {
//             console.error("Error creating indexes:", error);
//             setIndexResult(error instanceof Error ? error.message : "Unknown error creating indexes");
//             setIndexSuccess(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box p="md">
//             <Title order={2} mb="md">Database Analytics Management</Title>
//             <Text mb="md" color="dimmed" size="sm">
//                 This page provides advanced database operations and analytics tools. Use these features with caution as they directly affect database performance.
//             </Text>
            
//             <Tabs defaultValue="advanced-queries">
//                 <Tabs.List>
//                     <Tabs.Tab value="advanced-queries" leftSection={<IconChartBar size={16} />}>
//                         Advanced Queries (Task 5)
//                     </Tabs.Tab>
//                     <Tabs.Tab value="query-optimization" leftSection={<IconDatabase size={16} />}>
//                         Query Optimization (Task 6)
//                     </Tabs.Tab>
//                 </Tabs.List>

//                 <Tabs.Panel value="advanced-queries" pt="md">
//                     <Card withBorder p="md" radius="md" mb="md">
//                         <Title order={4} mb="xs">Doctor Availability Analysis</Title>
//                         <Text size="sm" color="dimmed" mb="md">
//                             This aggregation query analyzes which doctors have the most available time based on their slot schedules.
//                         </Text>
                        
//                         <Paper withBorder p="md" mb="md">
//                             <Title order={5} mb="md">Business Value</Title>
//                             <Text size="sm">
//                                 This analysis helps:
//                                 <ul>
//                                     <li>Track each doctor's total available time in minutes and hours</li>
//                                     <li>View the number of available slots per doctor</li>
//                                     <li>See doctor specializations alongside their availability</li>
//                                     <li>Identify doctors with the most capacity for new appointments</li>
//                                 </ul>
//                                 By directing patients to doctors with more available time, the system can reduce wait times and improve resource utilization.
//                             </Text>
//                         </Paper>
                        
//                         <Group mb="md">
//                             <Button 
//                                 leftSection={<IconClock size={16} />}
//                                 onClick={executeAvailabilityAnalysis} 
//                                 loading={availabilityLoading}
//                                 disabled={availabilityLoading}
//                                 color="teal"
//                             >
//                                 Analyze Doctor Availability
//                             </Button>
//                         </Group>

//                         {availabilityResult && (
//                             <>
//                                 <Divider my="md" />
//                                 <Text fw={500} mb="xs">Availability Analysis Results:</Text>
//                                 {availabilitySuccess !== null && (
//                                     <Alert 
//                                         mb="md" 
//                                         color={availabilitySuccess ? "green" : "red"}
//                                         title={availabilitySuccess ? "Success" : "Error"}
//                                         icon={availabilitySuccess ? <IconCheck size={16} /> : <IconX size={16} />}
//                                     >
//                                         {availabilitySuccess 
//                                             ? "Availability analysis executed successfully" 
//                                             : "Error executing availability analysis"}
//                                     </Alert>
//                                 )}
//                                 <Box mb="md">
//                                     <Alert title="Query Result Explanation" color="blue" mb="md">
//                                         Results show the total available minutes for each doctor, sorted by most available time. This helps identify which doctors have the most capacity for new appointments.
//                                     </Alert>
//                                 </Box>
//                                 <Code block>{availabilityResult}</Code>
//                             </>
//                         )}
//                     </Card>
//                 </Tabs.Panel>

//                 <Tabs.Panel value="query-optimization" pt="md">
//                     <Card withBorder p="md" radius="md" mb="md">
//                         <Title order={4} mb="xs">Doctor Availability Query Optimization</Title>
//                         <Text size="sm" color="dimmed" mb="md">
//                             Create compound indexes to significantly improve the performance of doctor availability analysis queries.
//                         </Text>
                        
//                         <Paper withBorder p="md" mb="md">
//                             <Title order={5} mb="md">Performance Impact</Title>
//                             <Text size="sm">
//                                 This optimization provides:
//                                 <ul>
//                                     <li>Faster doctor availability lookups by creating a compound index on doctor_id and time slots</li>
//                                     <li>Efficient time range queries for slot availability</li>
//                                     <li>Optimized aggregation pipeline performance</li>
//                                     <li>Reduced database load during peak hours</li>
//                                 </ul>
//                             </Text>
//                             <Divider my="sm" />
//                             <Text size="sm" component="pre" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
//                                 Performance Metrics:
//                                 - Without Index: ~200ms for availability analysis (scanning all slots)
//                                 - With Index: ~10ms for availability analysis (using index)
//                                 - Query Optimization: 95% reduction in response time
                                
//                                 Impact on Operations:
//                                 - Faster doctor availability checks
//                                 - More responsive scheduling system
//                                 - Better user experience for patients and staff
//                             </Text>
//                         </Paper>
                        
//                         <Code block mb="md">{criticalIndexesScript}</Code>
                        
//                         <Group mb="md">
//                             <Button 
//                                 leftSection={<IconArrowBarToDown size={16} />}
//                                 onClick={createCriticalIndexes}
//                                 loading={loading}
//                                 disabled={loading}
//                                 color="blue"
//                             >
//                                 Create Optimization Index
//                             </Button>
//                         </Group>

//                         {indexResult && (
//                             <>
//                                 <Divider my="md" />
//                                 <Text fw={500} mb="xs">Index Creation Results:</Text>
//                                 {indexSuccess !== null && (
//                                     <Alert 
//                                         mb="md" 
//                                         color={indexSuccess ? "green" : "red"}
//                                         title={indexSuccess ? "Success" : "Error"}
//                                         icon={indexSuccess ? <IconCheck size={16} /> : <IconX size={16} />}
//                                     >
//                                         {indexSuccess 
//                                             ? "Optimization index created successfully" 
//                                             : "Error creating optimization index"}
//                                     </Alert>
//                                 )}
//                                 <Box mb="md">
//                                     <Alert title="Optimization Details" color="blue" mb="md">
//                                         The compound index on slots collection optimizes doctor availability queries by:
//                                         <ul>
//                                             <li>Efficiently filtering slots by doctor_id</li>
//                                             <li>Quick access to time-based slot data</li>
//                                             <li>Supporting the aggregation pipeline used in availability analysis</li>
//                                         </ul>
//                                     </Alert>
//                                 </Box>
//                                 <Code block>{indexResult}</Code>
//                             </>
//                         )}
//                     </Card>
//                 </Tabs.Panel>
//             </Tabs>
//         </Box>
//     );
// }