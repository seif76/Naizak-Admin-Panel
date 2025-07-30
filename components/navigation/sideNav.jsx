// 'use client';
// import { useState } from 'react';
// import Link from 'next/link';

// import * as AiIcons from 'react-icons/ai';
// import * as FiIcons from 'react-icons/fi';
// import * as MdIcons from 'react-icons/md';

// export default function SideNav() {
//   const [openCustomer, setOpenCustomer] = useState(false);
//   const [openCaptain, setOpenCaptain] = useState(false);

//   const toggleCustomer = () => setOpenCustomer(!openCustomer);
//   const toggleCaptain = () => setOpenCaptain(!openCaptain);

//   const ArrowIcon = AiIcons.AiOutlineDown;

//   return (
//     <div className="w-64 h-screen bg-primary text-white p-4">
//       <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

//       {/* Customers */}
//       <div>
//         <button onClick={toggleCustomer} className="flex items-center justify-between w-full px-2 py-2 hover:bg-green-700 rounded">
//           <div className="flex items-center gap-2">
//             <MdIcons.MdPeopleOutline size={20} />
//             <span>Customers</span>
//           </div>
//           <ArrowIcon className={`transition-transform ${openCustomer ? 'rotate-180' : ''}`} />
//         </button>
//         {openCustomer && (
//           <div className="ml-6 mt-2 space-y-1">
//             <Link href="/customers/list" className="block px-2 py-1 hover:bg-green-800 rounded">List</Link>
//             <Link href="/customers/addNew" className="block px-2 py-1 hover:bg-green-800 rounded">Add New</Link>
//           </div>
//         )}
//       </div>

//       {/* Captains */}
//       <div className="mt-4">
//         <button onClick={toggleCaptain} className="flex items-center justify-between w-full px-2 py-2 hover:bg-green-700 rounded">
//           <div className="flex items-center gap-2">
//             <MdIcons.MdDriveEta size={20} />
//             <span>Captains</span>
//           </div>
//           <ArrowIcon className={`transition-transform ${openCaptain ? 'rotate-180' : ''}`} />
//         </button>
//         {openCaptain && (
//           <div className="ml-6 mt-2 space-y-1">
//             <Link href="/captains/list" className="block px-2 py-1 hover:bg-green-800 rounded">List</Link>
//             <Link href="/captains/add" className="block px-2 py-1 hover:bg-green-800 rounded">Add New</Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import Link from 'next/link';

import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import { FaClipboardCheck } from 'react-icons/fa';

export default function SideNav() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openCaptain, setOpenCaptain] = useState(false);

  const toggleCustomer = () => setOpenCustomer(!openCustomer);
  const toggleCaptain = () => setOpenCaptain(!openCaptain);

  const ArrowIcon = AiIcons.AiOutlineDown;

  return (
    <div className="fixed pt-20 top-0 left-0 w-64 h-screen bg-primary text-white p-4 overflow-y-auto z-50">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      {/* Customers */}
      <div>
        <button
          onClick={toggleCustomer}
          className="flex items-center justify-between w-full px-2 py-2 hover:bg-green-700 rounded"
        >
          <div className="flex items-center gap-2">
            <MdIcons.MdPeopleOutline size={20} />
            <span>Customers</span>
          </div>
          <ArrowIcon className={`transition-transform ${openCustomer ? 'rotate-180' : ''}`} />
        </button>
        {openCustomer && (
          <div className="ml-6 mt-2 space-y-1">
            <Link href="/customers/list" className="block px-2 py-1 hover:bg-green-800 rounded">List</Link>
            <Link href="/customers/addNew" className="block px-2 py-1 hover:bg-green-800 rounded">Add New</Link>
          </div>
        )}
      </div>

      {/* Captains */}
      <div className="mt-4">
        <button
          onClick={toggleCaptain}
          className="flex items-center justify-between w-full px-2 py-2 hover:bg-green-700 rounded"
        >
          <div className="flex items-center gap-2">
            <MdIcons.MdDriveEta size={20} />
            <span>Captains</span>
          </div>
          <ArrowIcon className={`transition-transform ${openCaptain ? 'rotate-180' : ''}`} />
        </button>
        {openCaptain && (
          <div className="ml-6 mt-2 space-y-1">
            <Link href="/captains/list" className="block px-2 py-1 hover:bg-green-800 rounded">List</Link>
            <Link href="/captains/addNew" className="block px-2 py-1 hover:bg-green-800 rounded">Add New</Link>
            <Link href="/captains/pendingCaptains" className="block px-2 py-1 hover:bg-green-800 rounded">
             {/* <FaClipboardCheck /> */}
             <span>Pending Captains</span>
          </Link>
          </div>
        )}
      </div>
    </div>
  );
}

