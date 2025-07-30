// 'use client';

// import { useState } from 'react';
// import {
//   FaChevronDown,
//   FaLeaf,
//   FaClinicMedical,
//   FaShoppingBag,
//   FaCar,
//   FaHamburger,
//   FaPlus,
//   FaCog,
//   FaFileAlt,
//   FaUsers,
// } from 'react-icons/fa';

// export default function TopNavbar() {
//   const [showModules, setShowModules] = useState(false);

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow flex justify-between items-center px-6 py-3 h-16 border-b">
//       {/* Left: Logo / Title */}
//       <div className="flex items-center gap-6">
//         <h1 className="text-xl font-bold text-primary">ElNaizak</h1>
//         <div className="hidden lg:flex items-center gap-4 text-sm text-gray-700">
//           <button className="hover:text-primary flex items-center gap-1"><FaUsers /> Users</button>
//           <button className="hover:text-primary flex items-center gap-1"><FaFileAlt /> Reports</button>
//           <button className="hover:text-primary flex items-center gap-1"><FaCog /> Settings</button>
//         </div>
//       </div>

//       {/* Right: Module Selector */}
//       <div className="relative">
//         <button
//           onClick={() => setShowModules((prev) => !prev)}
//           className="flex items-center gap-2 border rounded px-4 py-2 hover:bg-gray-100"
//         >
//           <FaLeaf className="text-green-600" />
//           <span className="text-sm font-medium">Grocery</span>
//           <FaChevronDown className="text-gray-500" />
//         </button>

//         {showModules && (
//           <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4 grid grid-cols-2 gap-3">
//             <ModuleItem icon={<FaLeaf />} label="Grocery" active />
//             <ModuleItem icon={<FaClinicMedical />} label="Pharmacy" />
//             <ModuleItem icon={<FaShoppingBag />} label="Shop" />
//             <ModuleItem icon={<FaHamburger />} label="Food" />
//             <ModuleItem icon={<FaCar />} label="Rental" />
//             <ModuleItem icon={<FaCar />} label="Parcel" />
//             <ModuleItem icon={<FaPlus />} label="Add" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function ModuleItem({ icon, label, active }) {
//   return (
//     <button
//       className={`flex flex-col items-center p-3 rounded text-sm hover:bg-gray-100 ${
//         active ? 'bg-green-100 border border-green-400' : ''
//       }`}
//     >
//       <div className="text-xl">{icon}</div>
//       <span className="mt-1">{label}</span>
//     </button>
//   );
// }



'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaChevronDown,
  FaLeaf,
  FaClinicMedical,
  FaShoppingBag,
  FaCar,
  FaHamburger,
  FaPlus,
  FaCog,
  FaFileAlt,
  FaUsers,
} from 'react-icons/fa';

export default function TopNavbar() {
  const [showModules, setShowModules] = useState(false);
  const router  =  useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-4 py-3 flex items-center justify-between h-16 border-b">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-primary whitespace-nowrap">ElNaizak</h1>
      </div>

      {/* Center: Links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
        <button onClick={()=> router.push("/")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaUsers /> Users
        </button>
        <button onClick={()=> router.push("/")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaFileAlt /> Reports
        </button>
        <button onClick={()=> router.push("/settings")} className="hover:text-primary flex items-center gap-2 transition-all duration-150">
          <FaCog /> Settings
        </button>
      </div>

      {/* Right: Module Selector */}
      <div className="relative">
        <button
          onClick={() => setShowModules((prev) => !prev)}
          className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 transition-all text-sm"
        >
          <FaLeaf className="text-green-600" />
          <span>Grocery</span>
          <FaChevronDown className="text-gray-500" />
        </button>

        {showModules && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4 grid grid-cols-2 gap-3">
            <ModuleItem icon={<FaLeaf />} label="Grocery" active />
            <ModuleItem icon={<FaClinicMedical />} label="Pharmacy" />
            <ModuleItem icon={<FaShoppingBag />} label="Shop" />
            <ModuleItem icon={<FaHamburger />} label="Food" />
            <ModuleItem icon={<FaCar />} label="Rental" />
            <ModuleItem icon={<FaCar />} label="Parcel" />
            <ModuleItem icon={<FaPlus />} label="Add" />
          </div>
        )}
      </div>
    </nav>
  );
}

function ModuleItem({ icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center p-3 rounded text-sm hover:bg-gray-100 ${
        active ? 'bg-green-100 border border-green-400' : ''
      }`}
    >
      <div className="text-xl">{icon}</div>
      <span className="mt-1">{label}</span>
    </button>
  );
}

