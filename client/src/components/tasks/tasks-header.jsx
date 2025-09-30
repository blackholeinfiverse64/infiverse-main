"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Plus, ListTodo } from "lucide-react"
import { CreateTaskDialog } from "./create-task-dialog"

export function TasksHeader() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  return (
    <div className="relative group">
      {/* Header Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent rounded-3xl"></div>
      
      {/* Main Header Card */}
      <div className="relative backdrop-blur-xl bg-black/30 border border-white/20 rounded-3xl shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 p-8">
        {/* Electric Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/2 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        </div>

        <div className="relative flex items-center justify-between">
          {/* Header Content */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-2xl blur-sm"></div>
              <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
                <ListTodo className="h-8 w-8 text-cyan-300" />
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Task Management
                </span>
              </h1>
              <p className="text-lg text-cyan-200/80 font-medium">
                Manage and track tasks across all departments
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-70 mt-2"></div>
            </div>
          </div>

          {/* Create Task Button */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
            <Button 
              onClick={() => setIsCreateTaskOpen(true)}
              className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 backdrop-blur-md px-6 py-3"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
    </div>
  )
}
