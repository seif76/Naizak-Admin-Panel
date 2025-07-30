
import Sidenav from "@/components/navigation/sideNav";
import "./globals.css";
import TopNavbar from "@/components/navigation/Navbar";



export const metadata = {
  title: 'Admin Panel',
  description: 'Admin panel dashboard',
};
export default function RootLayout({ children }) {
  return (

  //   <html lang="en">
  //   <body className="flex flex-col min-h-screen">
  //     {/* Top Navbar */}
  //     <TopNavbar />

  //     {/* Layout: Sidebar + Content */}
  //     <div className="flex flex-1 pt-16"> {/* pt-16 to avoid overlap under fixed navbar */}
  //       <Sidenav />
  //       <main className="flex-1 p-6 bg-gray-100">{children}</main>
  //     </div>
  //   </body>
  // </html>
  <html lang="en">
  <body className="bg-gray-100">
    {/* Fixed Sidebar */}
    <Sidenav />

    {/* Main Layout */}
    <div className="ml-64"> {/* Shift content to the right of the fixed sidebar */}
      <TopNavbar /> {/* Optional: Add fixed class and height if needed */}

      <main className="p-6 pt-20 min-h-screen">
        {children}
      </main>
    </div>
  </body>
</html>
  );
}