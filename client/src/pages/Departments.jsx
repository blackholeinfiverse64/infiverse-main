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
    <div className={`space-y-6 electric-dashboard transition-all duration-700 ${
      isHidden 
        ? 'ml-0 p-4' 
        : 'ml-80 p-4'
    }`}>
      {/* Electric Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="electric-particles opacity-20"></div>
        <div className="electric-particles-small opacity-15"></div>
      </div>

      <div className="electric-header p-6 rounded-2xl relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-10 rounded-2xl"></div>
        <div className="relative z-10">
          <DepartmentHeader />
        </div>
      </div>
      
      <div className="electric-section relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <DepartmentList onDepartmentSelect={handleDepartmentSelect} />
      </div>
    </div>
  );
}

export default Departments;
