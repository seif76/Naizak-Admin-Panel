// 'use client';
// import { useState } from 'react';
// import axios from 'axios';

// export default function CaptainRegisterPage() {
//   const [step, setStep] = useState(1);
//   const [userData, setUserData] = useState({
//     name: '', email: '', password: '', phone_number: '', gender: 'male', profile_photo: ''
//   });

//   const [vehicleData, setVehicleData] = useState({
//     make: '', model: '', year: '', license_plate: '', vehicle_type: 'sedan', color: '',
//     driver_license_photo: '', national_id_photo: ''
//   });

//   const handleNext = () => {
//     if (userData.name && userData.email && userData.password && userData.phone_number) {
//       setStep(2);
//     } else {
//       alert('Please fill all personal fields');
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/captain/auth/register', {
//         user: userData,
//         vehicle: vehicleData,
//       });
//       alert('Captain registered successfully!');
//       setStep(1);
//       setUserData({ name: '', email: '', password: '', phone_number: '', gender: 'male', profile_photo: ''
//       });
    
//       setVehicleData({
//         make: '', model: '', year: '', license_plate: '', vehicle_type: 'sedan', color: '',
//         driver_license_photo: '', national_id_photo: ''
//       });
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto mt-8">
//       <h1 className="text-2xl font-bold mb-6">🚘 Register New Captain</h1>

//       {step === 1 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <input type="text" placeholder="Full Name" className="border p-2 rounded"
//             value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
//           <input type="email" placeholder="Email" className="border p-2 rounded"
//             value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })} />
//           <input type="text" placeholder="Phone Number" className="border p-2 rounded"
//             value={userData.phone_number} onChange={e => setUserData({ ...userData, phone_number: e.target.value })} />
//           <input type="password" placeholder="Password" className="border p-2 rounded"
//             value={userData.password} onChange={e => setUserData({ ...userData, password: e.target.value })} />
//           <select className="border p-2 rounded"
//             value={userData.gender} onChange={e => setUserData({ ...userData, gender: e.target.value })}>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//           <input type="text" placeholder="Profile Photo URL" className="border p-2 rounded"
//             value={userData.profile_photo} onChange={e => setUserData({ ...userData, profile_photo: e.target.value })} />
//           <div className="col-span-2 text-right">
//             <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded hover:bg-green-700">Next</button>
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <input type="text" placeholder="Make" className="border p-2 rounded"
//             value={vehicleData.make} onChange={e => setVehicleData({ ...vehicleData, make: e.target.value })} />
//           <input type="text" placeholder="Model" className="border p-2 rounded"
//             value={vehicleData.model} onChange={e => setVehicleData({ ...vehicleData, model: e.target.value })} />
//           <input type="number" placeholder="Year" className="border p-2 rounded"
//             value={vehicleData.year} onChange={e => setVehicleData({ ...vehicleData, year: e.target.value })} />
//           <input type="text" placeholder="License Plate" className="border p-2 rounded"
//             value={vehicleData.license_plate} onChange={e => setVehicleData({ ...vehicleData, license_plate: e.target.value })} />
//           <select className="border p-2 rounded"
//             value={vehicleData.vehicle_type} onChange={e => setVehicleData({ ...vehicleData, vehicle_type: e.target.value })}>
//             <option value="sedan">Sedan</option>
//             <option value="suv">SUV</option>
//             <option value="truck">Truck</option>
//           </select>
//           <input type="text" placeholder="Color" className="border p-2 rounded"
//             value={vehicleData.color} onChange={e => setVehicleData({ ...vehicleData, color: e.target.value })} />
//           <input type="text" placeholder="Driver License Photo URL" className="border p-2 rounded"
//             value={vehicleData.driver_license_photo} onChange={e => setVehicleData({ ...vehicleData, driver_license_photo: e.target.value })} />
//           <input type="text" placeholder="National ID Photo URL" className="border p-2 rounded"
//             value={vehicleData.national_id_photo} onChange={e => setVehicleData({ ...vehicleData, national_id_photo: e.target.value })} />
//           <div className="col-span-2 text-right flex justify-between">
//             <button onClick={() => setStep(1)} className="text-gray-700 hover:underline">Back</button>
//             <button onClick={handleSubmit} className="bg-primary text-white px-6 py-2 rounded hover:bg-green-700">Submit</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import axios from 'axios';

export default function CaptainRegisterPage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '', email: '', password: '', phone_number: '', gender: 'male', profile_photo: ''
  });

  const [vehicleData, setVehicleData] = useState({
    make: '', model: '', year: '', license_plate: '', vehicle_type: 'sedan', color: '',
    driver_license_photo: '', national_id_photo: ''
  });

  const handleNext = () => {
    if (userData.name && userData.email && userData.password && userData.phone_number) {
      setStep(2);
    } else {
      alert('Please fill all personal fields');
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/captains/register`, {
        user: userData,
        vehicle: vehicleData,
      });
      alert('Captain registered successfully!');
      setStep(1);
      setUserData({
        name: '', email: '', password: '', phone_number: '', gender: 'male', profile_photo: ''
      });
      setVehicleData({
        make: '', model: '', year: '', license_plate: '', vehicle_type: 'sedan', color: '',
        driver_license_photo: '', national_id_photo: ''
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="bg-white w-full rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🚘 Register New Captain</h1>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="input-style"
              value={userData.name}
              onChange={e => setUserData({ ...userData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-style"
              value={userData.email}
              onChange={e => setUserData({ ...userData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-style"
              value={userData.phone_number}
              onChange={e => setUserData({ ...userData, phone_number: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-style"
              value={userData.password}
              onChange={e => setUserData({ ...userData, password: e.target.value })}
            />
            <select
              className="input-style"
              value={userData.gender}
              onChange={e => setUserData({ ...userData, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="text"
              placeholder="Profile Photo URL"
              className="input-style"
              value={userData.profile_photo}
              onChange={e => setUserData({ ...userData, profile_photo: e.target.value })}
            />
            <div className="col-span-2 text-right">
              <button
                onClick={handleNext}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Make"
              className="input-style"
              value={vehicleData.make}
              onChange={e => setVehicleData({ ...vehicleData, make: e.target.value })}
            />
            <input
              type="text"
              placeholder="Model"
              className="input-style"
              value={vehicleData.model}
              onChange={e => setVehicleData({ ...vehicleData, model: e.target.value })}
            />
            <input
              type="number"
              placeholder="Year"
              className="input-style"
              value={vehicleData.year}
              onChange={e => setVehicleData({ ...vehicleData, year: e.target.value })}
            />
            <input
              type="text"
              placeholder="License Plate"
              className="input-style"
              value={vehicleData.license_plate}
              onChange={e => setVehicleData({ ...vehicleData, license_plate: e.target.value })}
            />
            <select
              className="input-style"
              value={vehicleData.vehicle_type}
              onChange={e => setVehicleData({ ...vehicleData, vehicle_type: e.target.value })}
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
            </select>
            <input
              type="text"
              placeholder="Color"
              className="input-style"
              value={vehicleData.color}
              onChange={e => setVehicleData({ ...vehicleData, color: e.target.value })}
            />
            <input
              type="text"
              placeholder="Driver License Photo URL"
              className="input-style"
              value={vehicleData.driver_license_photo}
              onChange={e => setVehicleData({ ...vehicleData, driver_license_photo: e.target.value })}
            />
            <input
              type="text"
              placeholder="National ID Photo URL"
              className="input-style"
              value={vehicleData.national_id_photo}
              onChange={e => setVehicleData({ ...vehicleData, national_id_photo: e.target.value })}
            />
            <div className="col-span-2 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 hover:underline"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

