"use client"

import { useState } from "react"
import { Plus, Building, Sparkles } from "lucide-react"
import { CreateDepartmentDialog } from "./create-department-dialog"

export function DepartmentHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* Electric Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-6 left-12 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-4 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-70"></div>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Header Content */}
        <div className="flex items-center gap-4">
          {/* Enhanced Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-xl blur-sm"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/40 rounded-xl flex items-center justify-center">
              <Building className="h-7 w-7 text-cyan-300" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Departments
            </h1>
            <p className="text-lg text-cyan-200/80 font-medium mt-1">
              Manage departments and their teams with AI-powered insights
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-70 mt-2"></div>
          </div>
        </div>

        {/* Enhanced Create Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl blur-sm"></div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="relative px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 text-white hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-md rounded-xl font-medium flex items-center gap-2 shadow-lg"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
              <Plus className="relative h-5 w-5" />
            </div>
            New Department
            
            {/* Electric Flash Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl transform -skew-x-12"></div>
          </button>
        </div>
      </div>

      <CreateDepartmentDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}
