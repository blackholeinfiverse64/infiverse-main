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
    <div className={`min-h-screen bg-black font-poppins transition-all duration-700 relative overflow-hidden ${
      isHidden 
        ? 'ml-0' 
        : 'ml-80'
    }`}>
      {/* Pure Black Universe Background with Enhanced Moving Particles at 135 Degrees */}
      <div className="fixed inset-0 bg-black z-0"></div>
      <div className="fixed inset-0 universe-particles-135 opacity-50 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-medium-135 opacity-45 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-large-135 opacity-40 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-extra-135 opacity-35 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-tiny-135 opacity-55 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-huge-135 opacity-30 pointer-events-none z-1"></div>
      
      <div className="relative z-10 space-y-8 p-4 md:p-6 lg:p-8">
        {/* Black Universe Header Section */}
        <div className="relative backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 p-8 bg-black overflow-hidden">
          {/* Enhanced Universe Particles inside Header Card */}
          <div className="absolute inset-0 universe-particles-135 opacity-40 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-45 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400/80 rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400/70 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-12 left-16 w-1.5 h-1.5 bg-purple-400/80 rounded-full animate-bounce opacity-70"></div>
          </div>

          <div className="relative z-10">
            <DepartmentHeader />
          </div>
        </div>
        
        {/* Black Universe Department List Section */}
        <div className="relative backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 bg-black overflow-hidden">
          {/* Enhanced Universe Particles inside List Card */}
          <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-blue-400/80 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-8 left-12 w-1 h-1 bg-cyan-400/70 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-20 left-1/4 w-1 h-1 bg-purple-400/80 rounded-full animate-bounce opacity-40"></div>
            <div className="absolute bottom-12 right-1/3 w-0.5 h-0.5 bg-cyan-300/80 rounded-full animate-ping opacity-80"></div>
          </div>

          <div className="relative z-10 p-6">
            <DepartmentList onDepartmentSelect={handleDepartmentSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Departments;
