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
import { getAgeDistribution, getTopDoctors, getSpecialtyStats } from '../../../../../utils/data';
import { 
  AgeDistributionDto, 
  TopDoctorsDto, 
  SpecialtyStatsDto 
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
        </Grid>
      )}
    </div>
  );
};

export default Analytics;