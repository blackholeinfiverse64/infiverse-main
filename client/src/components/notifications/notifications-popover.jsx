
// "use client";

// import { useState } from "react";
// import { Bell } from "lucide-react";
// import { Button } from "../ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Badge } from "../ui/badge";
// import { useDashboard } from "../../context/DashboardContext";
// import { useNavigate } from "react-router-dom";

// export function NotificationsPopover() {
//   const dashboardContext = useDashboard();
//   const { recentReviews = [], hasNewReviews = false, markReviewsAsSeen = () => {} } = dashboardContext || {};
//   const [readReviews, setReadReviews] = useState(new Set());
//   const navigate = useNavigate();

//   // Debug log to inspect recentReviews
//   console.log("recentReviews:", recentReviews);

//   // Ensure recentReviews is an array before filtering
//   const safeReviews = Array.isArray(recentReviews) ? recentReviews : [];
//   const unreadCount = safeReviews.filter((review) => !readReviews.has(review._id)).length;

//   const markAsRead = (reviewId) => {
//     setReadReviews((prev) => new Set([...prev, reviewId]));
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unreadCount} unread)`}>
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs">
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 bg-white border shadow-xl rounded-xl p-4" align="end">
//         <div className="flex items-center justify-between mb-3">
//           <h4 className="text-sm font-medium">Notifications</h4>
//           {unreadCount > 0 && (
//             <Button
//               variant="link"
//               size="sm"
//               onClick={() => {
//                 markReviewsAsSeen();
//                 setReadReviews(new Set(safeReviews.map((r) => r._id)));
//               }}
//               className="text-blue-600 text-xs"
//             >
//               Mark all as read
//             </Button>
//           )}
//         </div>
//         <div className="space-y-2 max-h-64 overflow-y-auto">
//           {safeReviews.length === 0 ? (
//             <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
//           ) : (
//             safeReviews.map((review) => (
//               <div
//                 key={review._id}
//                 className={`p-2 rounded-md text-sm ${
//                   readReviews.has(review._id) ? "bg-muted/50" : "bg-blue-50 dark:bg-blue-900/20"
//                 } cursor-pointer hover:bg-muted`}
//                 onClick={() => {
//                   markAsRead(review._id);
//                   navigate(`/tasks/${review.task._id}`);
//                 }}
//               >
//                 <p className="font-medium">
//                   Submission for "{review.task?.title || "Unknown Task"}" was {review.status}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {new Date(review.updatedAt).toLocaleString()}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }



import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/api";

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedUser = localStorage.getItem("WorkflowUser");
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!userId) return;

        const response = await axios.get(
          `${API_URL}/user-notifications/${userId}`
        );
        const notificationsData = Array.isArray(response.data) ? response.data : [];
        setNotifications(notificationsData);
        setHasUnread(notificationsData.some((notification) => !notification.read));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const storedUser = localStorage.getItem("WorkflowUser");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      if (!userId) return;

      await axios.put(
        `${API_URL}/user-notifications/${notificationId}/read?userId=${userId}`
      );
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
      setHasUnread(notifications.some((notification) => notification._id !== notificationId && !notification.read));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const storedUser = localStorage.getItem("WorkflowUser");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      if (!userId) return;

      await axios.put(
        `${API_URL}/user-notifications/read-all?userId=${userId}`
      );
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
      setHasUnread(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const storedUser = localStorage.getItem("WorkflowUser");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      if (!userId) return;
  
      await axios.delete(`${API_URL}/user-notifications/${notificationId}?userId=${userId}`);
      setNotifications(notifications.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-105" aria-label={`Notifications (${notifications.length} unread)`}>
          <Bell className="h-5 w-5 text-cyan-300 hover:text-blue-300 transition-colors duration-300" />
          {hasUnread && (
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs border border-cyan-300/50 shadow-lg shadow-cyan-400/20 animate-pulse">
              {notifications.filter((notification) => !notification.read).length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 backdrop-blur-xl bg-black/20 border border-white/20 shadow-2xl shadow-black/50 rounded-2xl p-0 overflow-hidden" align="end">
        {/* Enhanced Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        {/* Electric Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-70"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Notifications
              </h4>
              <p className="text-sm text-cyan-200/80">Stay updated with your tasks</p>
            </div>
          </div>
          {hasUnread && (
            <Button
              variant="link"
              size="sm"
              onClick={markAllAsRead}
              className="text-cyan-300 hover:text-blue-300 text-sm font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-cyan-400/40 transition-all duration-300 rounded-lg px-3 py-1"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="relative z-10 space-y-2 max-h-80 overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-cyan-300/60" />
              </div>
              <p className="text-white/70 font-medium">No new notifications</p>
              <p className="text-white/50 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative group p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  notification.read 
                    ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20" 
                    : "bg-gradient-to-br from-cyan-400/20 to-blue-500/20 hover:from-cyan-400/30 hover:to-blue-500/30 border border-cyan-400/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-400/10"
                } hover:scale-[1.02] backdrop-blur-md`}
                onClick={() => {
                  markNotificationAsRead(notification._id);
                  navigate(`/tasks/${notification.task}`);
                }}
              >
                {/* Electric glow for unread notifications */}
                {!notification.read && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-xl blur-sm animate-pulse"></div>
                )}
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        notification.read 
                          ? "bg-white/10 border border-white/20" 
                          : "bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-400/50 shadow-lg"
                      }`}>
                        <Bell className={`w-4 h-4 ${notification.read ? "text-white/60" : "text-cyan-300"}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm leading-5 ${
                          notification.read ? "text-white/80" : "text-white"
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1 ${
                          notification.read ? "text-white/50" : "text-cyan-200/80"
                        }`}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs p-2 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 transition-all duration-300 rounded-lg opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
