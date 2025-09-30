"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "../components/dashboard/sidebar"
import { DashboardHeader } from "../components/dashboard/header"
import EnhancedStartDayDialog from "../components/attendance/EnhancedStartDayDialog"
import { useAuth } from "../context/auth-context"
import { SidebarProvider } from "../context/sidebar-context"
import api from "../lib/api"

export function DashboardLayout() {
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



  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex overflow-hidden electric-layout universe-background">
        {/* Enhanced Universe Background Elements */}
        <div className="fixed inset-0 universe-particles opacity-15 pointer-events-none"></div>
        <div className="fixed inset-0 universe-particles-medium opacity-10 pointer-events-none"></div>
        <div className="fixed inset-0 universe-particles-large opacity-5 pointer-events-none"></div>
        
        <div className="fixed inset-0 bg-cyber-grid opacity-15 pointer-events-none"></div>
        <div className="fixed inset-0 gradient-cyber opacity-10 pointer-events-none"></div>
        
        {/* Electric particles for main layout */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="electric-particles opacity-20"></div>
          <div className="electric-particles-small opacity-15"></div>
        </div>

        {/* New Sidebar - Always renders for both desktop and mobile */}
        <DashboardSidebar />

        {/* Fixed Header */}
        <DashboardHeader />

        {/* Main Content Container */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Main Content Area - Account for fixed header - Full screen layout */}
          <main className="flex-1 overflow-auto bg-background relative pt-20">
            <div className="h-full p-2 md:p-4 relative z-10">
              <div className="w-full animate-fade-in">
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
    </SidebarProvider>
  )
}