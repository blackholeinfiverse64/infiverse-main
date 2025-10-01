"use client"

import { useState } from "react"
import { TasksHeader } from "../components/tasks/tasks-header"
import { TasksList } from "../components/tasks/tasks-list"
import { TaskFilters } from "../components/tasks/task-filters"
import { useSidebar } from "../context/sidebar-context"

function Tasks() {
  const { isHidden } = useSidebar()
  const [filters, setFilters] = useState({
    status: [],
    department: [],
    priority: undefined,
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className={`min-h-screen bg-black space-y-8 font-poppins transition-all duration-700 relative overflow-hidden ${
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
        {/* Header Section */}
        <div className="relative">
          <TasksHeader />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TaskFilters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Tasks List */}
          <div className="lg:col-span-3">
            <TasksList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tasks
