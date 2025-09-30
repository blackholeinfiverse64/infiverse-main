import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Network, Users, Sparkles, Settings, CheckCircle, BarChart, Airplay, LayoutDashboardIcon, Target, Monitor, DollarSign, Calendar, Clock, UserCog, UserCheck } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { useSidebar } from "../../context/sidebar-context";

export function DashboardSidebar({ collapsed = false, onToggleCollapse }) {
  const { isHidden, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  const baseRoutes = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Tasks", href: "/tasks", icon: CheckSquare },
    { title: "Dependencies", href: "/dependencies", icon: Network },
    { title: "Departments", href: "/departments", icon: Users },
    { title: "AI Optimization", href: "/optimization", icon: Sparkles },
     { title: "All Aims", href: "/all-aims", icon: Target },
    { title: "Completed Tasks", href: "/completedtask", icon: CheckCircle },
     { title: "Leaderboard", href: "/leaderboard", icon: Sparkles },
  ];

  // Admin-only routes
  const adminRoutes = [
    { title: "Employee Monitoring", href: "/monitoring", icon: Monitor },
    { title: "User Management", href: "/user-management", icon: UserCog },
    // { title: "Live Attendance", href: "/attendance-dashboard", icon: Users },
    // { title: "Attendance Analytics", href: "/attendance-analytics", icon: Clock },
    // { title: "Salary Management", href: "/salary-management", icon: DollarSign },
    // { title: "Individual Salaries", href: "/individual-salary-management", icon: UserCog },
  ];

  // User-specific routes
  const userRoutes = [
    { title: "Dashboard", href: "/userdashboard", icon: LayoutDashboardIcon },
    { title: "Progress", href: "/progress", icon: BarChart },
    { title: "Set Aims", href: "/aims", icon: Airplay },
    // { title: "Leave Requests", href: "/leave-request", icon: Calendar },
    { title: "Leaderboard", href: "/leaderboard", icon: Sparkles },
  ];

  // Determine which routes to show based on user role
  let renderRoutes;
  if (user?.role === "User") {
    renderRoutes = userRoutes;
  } else if (user?.role === "Admin") {
    renderRoutes = [...baseRoutes, ...adminRoutes];
  } else {
    renderRoutes = baseRoutes; // For other roles like Manager, etc.
  }



  return (
    <>
      {/* Black Hole Toggle Button - Sized for header alignment */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="relative w-12 h-12 rounded-full overflow-hidden group transition-all duration-700 hover:scale-110"
        >
          {/* Black Hole Image */}
          <img 
            src="/blackhole.png" 
            alt="Toggle Sidebar"
            className="w-full h-full object-cover rounded-full"
          />
          
          {/* Electrical Blue Sparkle Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-purple-600/30 animate-electric-pulse"></div>
          
          {/* Electric Ring Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 animate-electric-ring"></div>
          <div className="absolute inset-1 rounded-full border border-blue-400/40 animate-electric-ring-reverse"></div>
          
          {/* Flash Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-electric-flash"></div>
          
          {/* Hover Glow */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
        </button>
      </div>

      {/* Glassmorphism Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-80 z-40 transition-all duration-700 ease-in-out ${
        isHidden ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
      }`}>
        <div className="h-full glassmorphism-sidebar backdrop-blur-xl bg-gradient-to-br from-slate-900/20 via-slate-800/10 to-slate-900/20 border-r border-cyan-400/20 shadow-2xl relative flex flex-col">
          {/* Enhanced Electric Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/3 to-purple-600/5"></div>
          <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
          
          {/* Electric particles animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="electric-particles-blue opacity-60"></div>
            <div className="electric-particles-cyan opacity-40"></div>
          </div>

          {/* Header Section */}
          <div className="relative z-10 p-6 border-b border-cyan-400/10 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg animate-glow-pulse">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Infiverse
              </span>
            </div>
          </div>

          {/* Navigation Container */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/40 scrollbar-track-transparent relative z-10 min-h-0 max-h-full">
            <div className="p-6 pb-12">
              {/* Main Navigation */}
              <nav className="space-y-3">
                {renderRoutes.map((route) => {
                  const isActive = location.pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      to={route.href}
                      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${
                        isActive
                          ? "glassmorphism-active text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30"
                          : "glassmorphism-inactive hover:glassmorphism-hover text-slate-300 hover:text-white hover:transform hover:scale-[1.02]"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-600/20 rounded-2xl"></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-lg shadow-cyan-400/50"></div>
                        </>
                      )}

                      {/* Icon */}
                      <div className={`relative z-10 p-2 rounded-xl transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-white shadow-lg'
                          : 'bg-gradient-to-br from-slate-700/30 to-slate-600/20 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-blue-500/15 group-hover:text-cyan-400'
                      }`}>
                        <route.icon className={`h-5 w-5 transition-all duration-500 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
                      </div>

                      {/* Text */}
                      <div className="relative z-10 flex-1">
                        <span className="text-sm font-semibold tracking-wide">
                          {route.title}
                        </span>
                      </div>

                      {/* Electric glow effect for active */}
                      {isActive && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                      )}
                    </Link>
                  );
                })}

                {/* Settings Button */}
                <Link
                  to="/settings"
                  className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${
                    location.pathname === '/settings' 
                      ? "glassmorphism-active text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30"
                      : "glassmorphism-inactive hover:glassmorphism-hover text-slate-300 hover:text-white hover:transform hover:scale-[1.02]"
                  }`}
                >
                  {location.pathname === '/settings' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-600/20 rounded-2xl"></div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-lg shadow-cyan-400/50"></div>
                    </>
                  )}
                  <div className={`relative z-10 p-2 rounded-xl transition-all duration-500 ${
                    location.pathname === '/settings'
                      ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-white shadow-lg'
                      : 'bg-gradient-to-br from-slate-700/30 to-slate-600/20 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-blue-500/15 group-hover:text-cyan-400'
                  }`}>
                    <Settings className={`h-5 w-5 transition-all duration-500 group-hover:rotate-90 ${location.pathname === '/settings' ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <span className="text-sm font-semibold tracking-wide">
                      Settings
                    </span>
                  </div>
                  {location.pathname === '/settings' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                  )}
                </Link>
              </nav>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}