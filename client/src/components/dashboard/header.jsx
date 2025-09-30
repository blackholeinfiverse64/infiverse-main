// "use client"

// import { useState } from "react"
// import { Search } from "lucide-react"
// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import { ModeToggle } from "../mode-toggle"
// import { NotificationsPopover } from "../notifications/notifications-popover"
// import { useAuth } from "../../context/auth-context"
// import { MobileMenuButton } from "../ui/mobile-menu-button"

// export function DashboardHeader({ sidebarOpen, onSidebarToggle }) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const { user } = useAuth()
  

//   return (
//     <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur-lg">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//          {/* Mobile Menu Button */}
        
        
//           <div className="block md:hidden z-50">
//           <MobileMenuButton isOpen={sidebarOpen} onClick={onSidebarToggle} className="mr-3" />
//         </div>
        

//         <div className="relative max-w-md flex-1 hidden md:flex">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search tasks, departments..."
//             className="w-full pl-8"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-1 items-center justify-end space-x-4">
//           <NotificationsPopover />
//           <ModeToggle />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
//                   <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               className="w-56 bg-popover/90 backdrop-blur-md border border-border shadow-xl rounded-xl"
//               align="end"
//               forceMount
//             >
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
//                   <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Profile</DropdownMenuItem>
//               <DropdownMenuItem>Settings</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Log out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }

"use client"

import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { NotificationsPopover } from "../notifications/notifications-popover"
import { useAuth } from "../../context/auth-context"
import { useSidebar } from "../../context/sidebar-context"
import { MobileMenuButton } from "../ui/mobile-menu-button"
import { EnhancedSearch } from "./enhanced-search"
import { UserDetailsModal } from "./user-details-modal"
import { Alerts } from "../notifications/Alerts";



export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const { user, logout } = useAuth()
  const { isHidden } = useSidebar()

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser)
    setShowUserModal(true)
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-20 bg-gradient-to-r from-black/40 via-slate-900/50 to-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl z-40">
      <div className="flex h-full items-center justify-between px-2 md:px-4 relative">
        {/* Left spacer - Aligned with black hole logo */}
        <div className="flex items-center">
          <div className="w-16"></div>
        </div>

        {/* Right-aligned content with enhanced styling */}
        <div className="flex items-center space-x-2 md:space-x-3 pr-2 md:pr-4">
          {/* Enhanced Search Bar - Compact for full screen */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-purple-600/30 rounded-xl blur-sm animate-electric-pulse"></div>
            <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-400/40 rounded-xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 hover:border-blue-500/50">
              <EnhancedSearch onUserSelect={handleUserSelect} />
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Enhanced Notifications - Compact */}
            <NotificationsPopover />
            
            {/* Enhanced Alerts - Compact */}
            <Alerts />
          </div>

          {/* Enhanced User Menu - Compact */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full transition-all duration-300 hover:scale-105">
                <Avatar className="h-9 w-9 transition-all duration-300">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-bold shadow-inner">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-black/60 shadow-lg animate-pulse"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 backdrop-blur-xl bg-black/20 border border-white/20 shadow-2xl rounded-xl p-3 animate-scale-in"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4 text-white">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-400/50">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate text-white">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-blue-200 mt-1 truncate">{user?.email || "user@example.com"}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 mt-2 border border-blue-400/30">
                        {user?.role || "User"}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-white/20" />
              <DropdownMenuItem className="rounded-xl transition-all duration-300 hover:bg-white/10 text-white hover:text-blue-300 focus:bg-white/10 focus:text-blue-300 p-3 my-1">
                <svg className="mr-3 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl transition-all duration-300 hover:bg-white/10 text-white hover:text-blue-300 focus:bg-white/10 focus:text-blue-300 p-3 my-1">
                <svg className="mr-3 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-white/20" />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-xl transition-all duration-300 hover:bg-red-500/20 text-red-400 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300 p-3 my-1"
              >
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </header>
  )
}
