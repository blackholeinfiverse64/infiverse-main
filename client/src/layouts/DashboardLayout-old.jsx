"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "../components/dashboard/sidebar"
import { DashboardHeader } from "../components/dashboard/header"
import EnhancedStartDayDialog from "../components/attendance/EnhancedStartDayDialog"
import { useAuth } from "../context/auth-context"
import api from "../lib/api"

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="flex-shrink-0 z-navbar">
          <div className="glass-card m-4 mb-0 rounded-b-none border-b-0">
            <DashboardHeader sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-black">
          <div className="container-responsive py-6">
            <Outlet />
            <EnhancedStartDayDialog
              isOpen={showStartDayDialog}
              onClose={() => setShowStartDayDialog(false)}
              onSuccess={handleStartDaySuccess}
            />
          </div>
        </main>
      </div>
    </div>
  )Sidebar } from "../components/dashboard/sidebar"
import { DashboardHeader } from "../components/dashboard/header"
import EnhancedStartDayDialog from "../components/attendance/EnhancedStartDayDialog"
import { useAuth } from "../context/auth-context"
import api from "../lib/api"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user } = useAuth()
  const [showStartDayDialog, setShowStartDayDialog] = useState(false)
  const [checkedPrompt, setCheckedPrompt] = useState(false)

  useEffect(() => {
    // Only check once after login
    if (!user || checkedPrompt) return

    const dateKey = new Date().toISOString().slice(0, 10)
    const storageKey = `startDayPromptShown:${user.id}:${dateKey}`

    // If user already started day previously or we've shown the prompt manually today, skip
    if (localStorage.getItem(storageKey)) {
      setCheckedPrompt(true)
      return
    }

    // Use verify endpoint to determine if the user can start day
    api
      .get(`/attendance/verify/${user.id}`)
      .then((res) => {
        const data = res?.data || res // handle both {success,data} and direct data
        if (data && data.canStartDay) {
          setShowStartDayDialog(true)
        }
      })
      .catch(() => {
        // On failure, do nothing; user can still start from Start Day page
      })
      .finally(() => {
        setCheckedPrompt(true)
      })
  }, [user, checkedPrompt])

  const handleStartDaySuccess = () => {
    if (!user) return
    const dateKey = new Date().toISOString().slice(0, 10)
    const storageKey = `startDayPromptShown:${user.id}:${dateKey}`
    localStorage.setItem(storageKey, "1")
    setShowStartDayDialog(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Add a class to the body to prevent scrolling when sidebar is open
    if (!sidebarOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-poppins">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => toggleSidebar()}
        />
      )}

      {/* Fixed Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-80'}`}>
          <div className="glass-sidebar h-full">
            <DashboardSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar collapsed={false} onToggleCollapse={() => {}} />
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 z-40">
          <DashboardHeader sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background relative">
          <div className="h-full p-4 md:p-6 lg:p-8 relative z-10">
            <div className="max-w-full mx-auto animate-fade-in">
              <Outlet />
              <EnhancedStartDayDialog
                isOpen={showStartDayDialog}
                onClose={() => setShowStartDayDialog(false)}
                onSuccess={handleStartDaySuccess}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}