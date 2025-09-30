"use client"

import { useState, useEffect } from "react"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { MoreHorizontal, Users, CheckSquare, Loader2, Grid3x3, List, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useToast } from "../../hooks/use-toast"
import { api } from "../../lib/api"
import { useSocketContext } from "../../context/socket-context"

export function DepartmentList({ onDepartmentSelect }) {
  const { toast } = useToast()
  const { events } = useSocketContext()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [departmentTasks, setDepartmentTasks] = useState({})
  const [viewMode, setViewMode] = useState('grid')

  // Helper function to count active members
  const getActiveMemberCount = (members) => {
    if (!Array.isArray(members)) return 0;
    // Filter out null/undefined members (these are inactive users that didn't populate)
    return members.filter(member => member && member._id).length;
  }

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true)
        const response = await api.departments.getDepartments()
        console.log('DepartmentList - Departments response:', response)

        // Handle new API response format
        const data = response.success ? response.data : response
        setDepartments(Array.isArray(data) ? data : [])
        
        // Fetch tasks for each department
        const tasksPromises = data.map(async (dept) => {
          try {
            const departmentId = dept._id || dept.id;
            if (!departmentId) {
              console.warn('Department missing ID:', dept);
              return {
                departmentId: dept.name || 'unknown',
                tasks: { total: 0, completed: 0 }
              };
            }

            const tasks = await api.departments.getDepartmentTasks(departmentId)
            // Filter tasks that have active assignees (tasks with null assignees are filtered out by backend)
            const activeTasks = tasks.filter(task => task.assignee && task.assignee._id);
            const completed = activeTasks.filter(task => task.status === "Completed").length
            
            return {
              departmentId: departmentId,
              tasks: {
                total: activeTasks.length,
                completed: completed
              }
            }
          } catch (error) {
            console.error(`Error fetching tasks for department ${dept.name}:`, error)
            return {
              departmentId: dept._id || dept.id || dept.name,
              tasks: { total: 0, completed: 0 }
            }
          }
        })
        
        const tasksResults = await Promise.all(tasksPromises)
        const tasksMap = {}
        tasksResults.forEach(result => {
          tasksMap[result.departmentId] = result.tasks
        })
        
        setDepartmentTasks(tasksMap)
        setError(null)
      } catch (err) {
        setError(err.message || "Failed to load departments")
        toast({
          title: "Error",
          description: err.message || "Failed to load departments",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [toast])

  // Listen for socket events to update departments
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]
      
      if (latestEvent.type === 'department-created') {
        setDepartments(prev => [...prev, latestEvent.data])
        setDepartmentTasks(prev => ({
          ...prev,
          [latestEvent.data._id || latestEvent.data.id]: { total: 0, completed: 0 }
        }))
      } 
      else if (latestEvent.type === 'department-updated') {
        setDepartments(prev => prev.map(dept => 
          (dept._id || dept.id) === (latestEvent.data._id || latestEvent.data.id) ? latestEvent.data : dept
        ))
      }
      else if (latestEvent.type === 'department-deleted') {
        setDepartments(prev => prev.filter(dept => (dept._id || dept.id) !== (latestEvent.data._id || latestEvent.data.id)))
        setDepartmentTasks(prev => {
          const newMap = {...prev}
          delete newMap[latestEvent.data._id || latestEvent.data.id]
          return newMap
        })
      }
    }
  }, [events])

  const handleDeleteDepartment = async (deptId) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        setIsDeleting(true)
        await api.departments.deleteDepartment(deptId)
        setDepartments(departments.filter(dept => (dept._id || dept.id) !== deptId))
        toast({
          title: "Success",
          description: "Department deleted successfully"
        })
      } catch (error) {
        console.error("Error deleting department:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete department",
          variant: "destructive"
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-8 overflow-hidden">
        {/* Animated star particles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse opacity-70"
               style={{animationDelay: '0s', animationDuration: '2.5s'}}></div>
          <div className="absolute top-12 right-16 w-0.5 h-0.5 bg-white/30 rounded-full animate-ping opacity-50"
               style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/35 rounded-full animate-bounce opacity-60"
               style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
          <div className="absolute bottom-16 left-20 w-0.5 h-0.5 bg-white/25 rounded-full animate-pulse opacity-40"
               style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
          <div className="absolute top-16 left-1/3 w-1 h-1 bg-white/45 rounded-full animate-ping opacity-65"
               style={{animationDelay: '2s', animationDuration: '2.8s'}}></div>
          <div className="absolute top-8 left-1/2 w-0.5 h-0.5 bg-white/30 rounded-full animate-bounce opacity-50"
               style={{animationDelay: '2.5s', animationDuration: '3.2s'}}></div>
        </div>
        
        <div className="relative flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse"></div>
            <Loader2 className="relative h-8 w-8 animate-spin text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mt-4">Loading Departments</h3>
          <p className="text-white/70 text-sm mt-1">Fetching department data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative backdrop-blur-sm bg-white/5 border border-red-500/20 rounded-xl p-8 overflow-hidden">
        {/* Electric particles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-6 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-orange-400 rounded-full animate-pulse opacity-40"></div>
        </div>
        
        <div className="relative text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-400/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Departments</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
            <button 
              onClick={() => window.location.reload()}
              className="relative px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 backdrop-blur-md rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Animated star field background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large bright stars */}
        <div className="absolute top-6 right-8 w-1 h-1 bg-white/45 rounded-full animate-pulse opacity-80"
             style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-16 right-20 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping opacity-75"
             style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute top-24 right-32 w-0.5 h-0.5 bg-white/35 rounded-full animate-bounce opacity-65"
             style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
        
        {/* Medium stars */}
        <div className="absolute bottom-12 left-12 w-1 h-1 bg-white/40 rounded-full animate-ping opacity-70"
             style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute bottom-24 left-24 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse opacity-55"
             style={{animationDelay: '1.5s', animationDuration: '4.5s'}}></div>
        <div className="absolute bottom-36 left-36 w-1 h-1 bg-white/45 rounded-full animate-bounce opacity-75"
             style={{animationDelay: '2.5s', animationDuration: '3s'}}></div>
        
        {/* Small twinkling stars */}
        <div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white/25 rounded-full animate-ping opacity-45"
             style={{animationDelay: '0.8s', animationDuration: '2s'}}></div>
        <div className="absolute top-32 left-1/3 w-1 h-1 bg-white/35 rounded-full animate-pulse opacity-60"
             style={{animationDelay: '1.8s', animationDuration: '3.2s'}}></div>
        <div className="absolute top-44 left-1/2 w-0.5 h-0.5 bg-white/30 rounded-full animate-bounce opacity-50"
             style={{animationDelay: '2.8s', animationDuration: '2.8s'}}></div>
        
        {/* Scattered constellation stars */}
        <div className="absolute bottom-6 right-1/3 w-0.5 h-0.5 bg-white/20 rounded-full animate-ping opacity-40"
             style={{animationDelay: '0.3s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-18 right-1/2 w-1 h-1 bg-white/35 rounded-full animate-pulse opacity-55"
             style={{animationDelay: '1.3s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-30 right-2/3 w-0.5 h-0.5 bg-white/25 rounded-full animate-bounce opacity-45"
             style={{animationDelay: '2.3s', animationDuration: '3.5s'}}></div>
        
        {/* Corner accent stars */}
        <div className="absolute top-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-ping opacity-65"
             style={{animationDelay: '3.3s', animationDuration: '2.5s'}}></div>
        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse opacity-50"
             style={{animationDelay: '4.3s', animationDuration: '3.8s'}}></div>
        <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/25 rounded-full animate-bounce opacity-45"
             style={{animationDelay: '5.3s', animationDuration: '4.2s'}}></div>
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-white/35 rounded-full animate-ping opacity-60"
             style={{animationDelay: '6.3s', animationDuration: '3.6s'}}></div>
      </div>

      <div className="relative p-6">
        {/* Enhanced Header with View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
              <div className="relative w-10 h-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                All Departments ({departments.length})
              </h3>
              <p className="text-white/70 text-sm">Manage and view all departments</p>
            </div>
          </div>
          
          {/* Enhanced View Toggle */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
            <div className="relative flex bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div>
            {departments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-cyan-300/60" />
                </div>
                <p className="text-white/70 font-medium">No departments found. Create a new department to get started.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map((department) => {
                  const departmentId = department._id || department.id;
                  const tasks = departmentTasks[departmentId] || { total: 0, completed: 0 }
                  const completionPercentage = tasks.total > 0 
                    ? Math.round((tasks.completed / tasks.total) * 100) 
                    : 0
                  
                  // Count only active members (backend filters inactive users to null)
                  const activeMemberCount = getActiveMemberCount(department.members);
                  
                  return (
                    <div 
                      key={departmentId}
                      onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
                      className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden group hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-cyan-400/30"
                    >
                      {/* Electric particle effect on hover */}
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        {/* Department Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Enhanced Department Color Indicator */}
                            <div className="relative">
                              <div className="absolute inset-0 rounded-lg blur-sm" style={{ backgroundColor: department.color + '40' }}></div>
                              <div 
                                className="relative w-4 h-4 rounded-lg shadow-inner" 
                                style={{ 
                                  backgroundColor: department.color,
                                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px ${department.color}60`
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-1">{department.name}</h4>
                              <p className="text-white/70 text-sm line-clamp-2">{department.description}</p>
                            </div>
                          </div>
                          
                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-lg blur-sm"></div>
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="relative p-2 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-md rounded-lg"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-white" />
                                  <span className="sr-only">Menu</span>
                                </button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border border-white/20">
                              <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
                                className="text-white hover:bg-white/10"
                              >
                                View Department
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">Edit Department</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/20" />
                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDepartment(departmentId);
                                }}
                                disabled={isDeleting}
                              >
                                Delete Department
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Department Lead */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-8 h-8 border border-cyan-400/30">
                            <AvatarImage 
                              src={department.lead?.avatar || "/placeholder.svg?height=40&width=40"} 
                              alt={department.lead?.name || "Lead"} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 text-xs">
                              {department.lead?.name ? department.lead.name.charAt(0) : "L"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                              {department.lead?.name || "No lead assigned"}
                              {department.lead && !department.lead.stillExist && (
                                <span className="text-xs text-red-400 ml-1">(Inactive)</span>
                              )}
                            </div>
                            <div className="text-xs text-cyan-200/70">Department Lead</div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm text-white">{activeMemberCount} Active Members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">
                              {tasks.completed}/{tasks.total} Tasks
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/80">Task Completion</span>
                            <span className="text-cyan-300 font-medium">{completionPercentage}%</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div>
            {departments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-cyan-300/60" />
                </div>
                <p className="text-white/70 font-medium">No departments found. Create a new department to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map((department) => {
                  const departmentId = department._id || department.id;
                  const tasks = departmentTasks[departmentId] || { total: 0, completed: 0 }
                  const completionPercentage = tasks.total > 0 
                    ? Math.round((tasks.completed / tasks.total) * 100) 
                    : 0
                  
                  // Count only active members (backend filters inactive users to null)
                  const activeMemberCount = getActiveMemberCount(department.members);
                    
                  return (
                    <div 
                      key={departmentId}
                      onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
                      className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden group hover:bg-white/10 transition-all duration-300 cursor-pointer hover:border-cyan-400/30"
                    >
                      {/* Electric particle effect on hover */}
                      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Enhanced Department Icon */}
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full blur-sm" style={{ backgroundColor: department.color + '40' }}></div>
                            <div
                              className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                              style={{ 
                                backgroundColor: department.color,
                                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 0 15px ${department.color}60`
                              }}
                            >
                              {department.name.charAt(0)}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-white text-lg">{department.name}</h3>
                            <p className="text-white/70 text-sm">{department.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Stats */}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm text-white">{activeMemberCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">
                              {tasks.completed}/{tasks.total}
                            </span>
                          </div>
                          
                          {/* Progress Badge */}
                          <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-full">
                            <span className="text-cyan-300 font-medium text-sm">{completionPercentage}%</span>
                          </div>

                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-lg blur-sm"></div>
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="relative p-2 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-md rounded-lg"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-white" />
                                  <span className="sr-only">Menu</span>
                                </button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border border-white/20">
                              <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
                                className="text-white hover:bg-white/10"
                              >
                                View Department
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">Edit Department</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/20" />
                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDepartment(departmentId);
                                }}
                                disabled={isDeleting}
                              >
                                Delete Department
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}