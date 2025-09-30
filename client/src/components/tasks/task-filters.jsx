"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { Filter, CheckSquare, Building2, AlertTriangle } from "lucide-react"
import { api } from "../../lib/api"

export function TaskFilters({ onFilterChange }) {
  const [status, setStatus] = useState([])
  const [department, setDepartment] = useState([])
  const [priority, setPriority] = useState("all")
  const [departments, setDepartments] = useState([])

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.departments.getDepartments()
        console.log('TaskFilters - Departments response:', response)

        // Handle new API response format
        const data = response.success ? response.data : response
        setDepartments(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching departments:", error)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  const handleStatusChange = (value, checked) => {
    setStatus(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    )
  }

  const handleDepartmentChange = (value, checked) => {
    setDepartment(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    )
  }

  const handleApplyFilters = () => {
    onFilterChange({
      status,
      department,
      priority: priority === "all" ? undefined : priority,
    })
  }

  return (
    <div className="relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl overflow-hidden">
      {/* Electric Particles Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10"></div>
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-xl blur-sm"></div>
            <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3">
              <Filter className="h-5 w-5 text-cyan-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Filters
          </h3>
        </div>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-cyan-300">Status</h4>
            </div>
            <div className="space-y-3 pl-6">
              {["Completed", "In Progress", "Pending"].map(stat => (
                <div key={stat} className="flex items-center space-x-3 group">
                  <Checkbox 
                    id={`status-${stat.toLowerCase()}`} 
                    onCheckedChange={(checked) => handleStatusChange(stat, checked)}
                    className="border-white/30 text-cyan-400 focus:ring-cyan-400/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <Label 
                    htmlFor={`status-${stat.toLowerCase()}`}
                    className="text-white/80 group-hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
                  >
                    {stat}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Department Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-cyan-300">Department</h4>
            </div>
            <div className="space-y-3 pl-6 max-h-48 overflow-y-auto">
              {Array.isArray(departments) && departments.map(dept => (
                <div key={dept._id} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`dept-${dept._id}`}
                    onCheckedChange={(checked) => handleDepartmentChange(dept._id, checked)}
                    className="border-white/30 text-cyan-400 focus:ring-cyan-400/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <Label 
                    htmlFor={`dept-${dept._id}`}
                    className="text-white/80 group-hover:text-cyan-300 transition-colors duration-200 cursor-pointer text-sm"
                  >
                    {dept.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-cyan-300">Priority</h4>
            </div>
            <div className="pl-6">
              <RadioGroup value={priority} onValueChange={setPriority} className="space-y-3">
                {["all", "High", "Medium", "Low"].map(prio => (
                  <div key={prio} className="flex items-center space-x-3 group">
                    <RadioGroupItem 
                      value={prio} 
                      id={`priority-${prio.toLowerCase()}`}
                      className="border-white/30 text-cyan-400 focus:ring-cyan-400/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label 
                      htmlFor={`priority-${prio.toLowerCase()}`}
                      className="text-white/80 group-hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
                    >
                      {prio === "all" ? "All Priorities" : prio}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
              <Button 
                className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-[1.02] backdrop-blur-md"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
