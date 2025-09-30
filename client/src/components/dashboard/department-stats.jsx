"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Loader2 } from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function DepartmentStats({ onDepartmentSelect }) {
  const { toast } = useToast()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        setIsLoading(true)
        const data = await api.dashboard.getDepartmentStats()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching department stats:", error)
        toast({
          title: "Error",
          description: "Failed to load department statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartmentStats()
  }, [toast])

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Department Progress</CardTitle>
          <CardDescription>Task completion by department</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (departments.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Department Progress</CardTitle>
          <CardDescription>Task completion by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No department data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {departments.map((department) => (
          <div 
            key={department._id || department.id || department.name} 
            className="relative group cursor-pointer"
            onClick={() => onDepartmentSelect && onDepartmentSelect(department)}
          >
            {/* Hover Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            
            {/* Main Department Item */}
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/10">
              {/* Electric Particles on Hover */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-2 right-3 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Enhanced Department Color Indicator */}
                    <div className="relative">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" 
                        style={{ 
                          backgroundColor: department.color,
                          boxShadow: `0 0 10px ${department.color}40`
                        }}
                      />
                      <div 
                        className="absolute inset-0 w-4 h-4 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-ping" 
                        style={{ backgroundColor: department.color }}
                      />
                    </div>
                    <span className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors duration-300">
                      {department.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70 group-hover:text-cyan-300 transition-colors duration-300 font-medium">
                      {department.completed || 0}/{department.total || 0}
                    </span>
                    <span className="text-xs text-white/50 group-hover:text-cyan-400 transition-colors duration-300">
                      ({department.total > 0 ? Math.round((department.completed / department.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Progress Bar with Visible Fill */}
                <div className="relative">
                  {/* Background Track */}
                  <div className="w-full h-4 bg-gradient-to-r from-white/10 to-white/5 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    {/* Progress Fill */}
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover:scale-y-110 origin-bottom"
                      style={{ 
                        width: `${department.total > 0 ? Math.max((department.completed / department.total) * 100, 2) : 2}%`,
                        background: `linear-gradient(90deg, ${department.color}ff, ${department.color}cc, ${department.color}ff)`,
                        boxShadow: `0 0 15px ${department.color}80, inset 0 1px 0 rgba(255,255,255,0.3)`
                      }}
                    >
                      {/* Inner Highlight */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1/2 rounded-full opacity-60"
                        style={{
                          background: `linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)`
                        }}
                      />
                      
                      {/* Progress Bar Shimmer Effect */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
                          animation: 'shimmer 2s infinite'
                        }}
                      />
                      
                      {/* Completion Indicator */}
                      {department.completed === department.total && department.total > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse">
                          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Percentage Label */}
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30 shadow-lg">
                      {department.total > 0 ? Math.round((department.completed / department.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
