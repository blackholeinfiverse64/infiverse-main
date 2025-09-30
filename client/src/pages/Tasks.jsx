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
    <div className={`h-screen flex flex-col space-y-6 overflow-y-auto electric-dashboard transition-all duration-700 ${
      isHidden 
        ? 'ml-0' 
        : 'ml-80'
    }`}>
      {/* Electric Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="electric-particles opacity-20"></div>
        <div className="electric-particles-small opacity-15"></div>
      </div>

      <div className="relative z-10">
        <TasksHeader />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 px-4 md:px-6 pb-6 relative z-10">
        <div className="md:w-1/4 electric-section">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <TaskFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1 electric-section">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <TasksList filters={filters} />
        </div>
      </div>
    </div>
  )
}

export default Tasks
