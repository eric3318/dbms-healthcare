import { useEffect, useState } from 'react';
import { 
  Doctor, 
  getAllDoctors
} from '../../utils/doctors';
import { useNavigate } from 'react-router-dom';
import './DoctorBooking.css';

const DoctorBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctors(data || []);
        
        // Extract unique specialties for the filter
        const uniqueSpecialties = Array.from(
          new Set((data || []).map(doctor => doctor.specialization || '').filter(specialty => specialty))
        );
        setSpecialties(uniqueSpecialties);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        setLoading(false);
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to slot selection page with the doctor ID
    navigate(`/booking/${doctorId}`);
  };

  const filteredDoctors = specialtyFilter 
    ? doctors.filter(doctor => doctor.specialization === specialtyFilter)
    : doctors;

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="doctor-booking-container">
      <h2>Book an Appointment</h2>
      
      <div className="filter-section">
        <label htmlFor="specialty-filter">Filter by Specialty:</label>
        <select 
          id="specialty-filter"
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
        >
          <option value="">All Specialties</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>
      
      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.name}</h3>
              <div className="doctor-info">
                <p><strong>Specialty:</strong> {doctor.specialization}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
              </div>
              <button 
                className="book-button"
                onClick={() => doctor.id && handleBookAppointment(doctor.id)}
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="no-doctors">
            {specialtyFilter 
              ? `No doctors found with specialty: ${specialtyFilter}` 
              : 'No doctors available at the moment.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorBooking;