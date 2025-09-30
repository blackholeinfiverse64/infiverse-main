import { useState } from "react";
import { DepartmentList } from "../components/departments/department-list";
import { DepartmentHeader } from "../components/departments/department-header";
import { DepartmentDetails } from "../components/departments/DepartmentDetails";
import { useSidebar } from "../context/sidebar-context"

function Departments() {
  const { isHidden } = useSidebar()
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
  };

  if (selectedDepartment) {
    return (
      <DepartmentDetails 
        department={selectedDepartment} 
        onBack={handleBackToDepartments} 
      />
    );
  }

  return (
    <div className={`min-h-screen bg-black space-y-8 font-poppins transition-all duration-700 ${
      isHidden 
        ? 'ml-0 p-4 md:p-6 lg:p-8' 
        : 'ml-80 p-4 md:p-6 lg:p-8'
    }`}>
      {/* Enhanced Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Enhanced Electric Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large floating particles */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-40 left-16 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-60 left-40 w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping opacity-70"></div>
        
        {/* Medium particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-cyan-200 rounded-full animate-ping opacity-50"></div>
        
        {/* Small ambient particles */}
        <div className="absolute top-10 left-10 w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-ping opacity-25"></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-purple-200 rounded-full animate-bounce opacity-15"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative group">
          {/* Header Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent rounded-3xl"></div>
          
          {/* Main Header Card */}
          <div className="relative backdrop-blur-xl bg-black/5 border border-white/10 rounded-3xl shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 p-8">
            {/* Electric Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-12 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-70"></div>
            </div>

            <DepartmentHeader />
          </div>
        </div>
        
        {/* Enhanced Department List Section */}
        <div className="relative group">
          {/* List Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-purple-600/15 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-400/5 to-transparent rounded-2xl"></div>
          
          {/* Main List Card */}
          <div className="relative backdrop-blur-xl bg-black/5 border border-white/10 rounded-2xl shadow-xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30">
            {/* Electric Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute bottom-8 left-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
              <div className="absolute top-20 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
              <div className="absolute bottom-12 right-1/3 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping opacity-80"></div>
            </div>

            <div className="relative p-6">
              <DepartmentList onDepartmentSelect={handleDepartmentSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Departments;
