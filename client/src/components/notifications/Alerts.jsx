
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { useSocket } from "../../context/socket-context";

export function Alerts() {
  const { monitoringAlerts } = useSocket();
  const [readAlerts, setReadAlerts] = useState(new Set());

  const unreadCount = monitoringAlerts.filter((alert) => !readAlerts.has(alert.data._id)).length;

  const markAsRead = (alertId) => {
    setReadAlerts((prev) => new Set([...prev, alertId]));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-105" aria-label={`Alerts (${unreadCount} unread)`}>
          <AlertTriangle className="h-5 w-5 text-orange-300 hover:text-red-300 transition-colors duration-300" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs border border-orange-300/50 shadow-lg shadow-orange-400/20 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 backdrop-blur-xl bg-black/20 border border-white/20 shadow-2xl shadow-black/50 rounded-2xl p-0 overflow-hidden" align="end">
        {/* Enhanced Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-500/5 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,146,60,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(239,68,68,0.1),transparent_70%)]"></div>
        
        {/* Electric Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-4 right-6 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-70"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-500/40 rounded-xl blur-sm"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-orange-400/30 to-red-500/30 backdrop-blur-md border border-orange-400/50 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 text-orange-300" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Monitoring Alerts
              </h4>
              <p className="text-sm text-orange-200/80">System alerts and warnings</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setReadAlerts(new Set(monitoringAlerts.map((a) => a.data._id)));
              }}
              className="text-orange-300 hover:text-red-300 text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-orange-400/40 transition-all duration-300 rounded-lg px-3 py-1"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Alerts List */}
        <div className="relative z-10 space-y-2 max-h-80 overflow-y-auto p-4">
          {monitoringAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-300/60" />
              </div>
              <p className="text-white/70 font-medium">No new alerts</p>
              <p className="text-white/50 text-sm mt-1">System is running smoothly!</p>
            </div>
          ) : (
            monitoringAlerts.map((alert) => (
              <div
                key={alert.data._id}
                className={`relative group p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  readAlerts.has(alert.data._id)
                    ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                    : "bg-gradient-to-br from-orange-400/20 to-red-500/20 hover:from-orange-400/30 hover:to-red-500/30 border border-orange-400/30 hover:border-orange-400/50 shadow-lg shadow-orange-400/10"
                } hover:scale-[1.02] backdrop-blur-md`}
                onClick={() => markAsRead(alert.data._id)}
              >
                {/* Electric glow for unread alerts */}
                {!readAlerts.has(alert.data._id) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-500/10 rounded-xl blur-sm animate-pulse"></div>
                )}
                
                <div className="relative z-10 flex items-start gap-3">
                  {/* Alert Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    readAlerts.has(alert.data._id)
                      ? "bg-white/10 border border-white/20"
                      : "bg-gradient-to-br from-orange-400/30 to-red-500/30 border border-orange-400/50 shadow-lg"
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${readAlerts.has(alert.data._id) ? "text-white/60" : "text-orange-300"}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm leading-5 ${
                      readAlerts.has(alert.data._id) ? "text-white/80" : "text-white"
                    }`}>
                      {alert.data.title}
                    </p>
                    <p className={`text-xs mt-1 ${
                      readAlerts.has(alert.data._id) ? "text-white/60" : "text-orange-200/80"
                    }`}>
                      {alert.data.description}
                    </p>
                    <p className={`text-xs mt-1 ${
                      readAlerts.has(alert.data._id) ? "text-white/50" : "text-orange-200/60"
                    }`}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
