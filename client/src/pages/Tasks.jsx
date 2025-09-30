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
    <div className={`min-h-screen bg-black space-y-8 font-poppins transition-all duration-700 ${
      isHidden 
        ? 'ml-0' 
        : 'ml-80'
    } p-4 md:p-6 lg:p-8`}>
      {/* Enhanced Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Electric Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-60 left-40 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-60 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce opacity-40"></div>
      </div>

      <div className="relative z-10 space-y-8">
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
