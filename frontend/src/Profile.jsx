import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8081/profile')
      .then(res => {
        if (res.data.Status === 'Success') {
          setProfileData(res.data.Profile);
          setLoading(false);
        } else {
          alert('Error fetching profile data');
        }
      })
      .catch(err => {
        console.error('Error fetching profile data:', err);
        alert('Error fetching profile data');
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  return (
    <div className='px-5 py-3'>
      <h3>Admin Profile</h3>
      <div>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Role:</strong> {profileData.role}</p>
      </div>
    </div>
  );
}

export default Profile;
