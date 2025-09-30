import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { api } from "../../lib/api";
import { format } from "date-fns";

export function DepartmentDetails({ department, onBack }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState({
    users: [],
    tasks: [],
    aims: [],
    stats: {}
  });

  useEffect(() => {
    if (department) {
      fetchDepartmentDetails();
    }
  }, [department]);

  const fetchDepartmentDetails = async () => {
    try {
      setLoading(true);
      
      // Get department ID (handle both _id and id)
      const departmentId = department._id || department.id;
      if (!departmentId) {
        throw new Error("Department ID is missing");
      }

      console.log("Fetching details for department:", departmentId, department);
      
      // Fetch department users
      const usersResponse = await api.users.getUsers();
      const departmentUsers = usersResponse.filter(user => 
        user.department && (user.department._id === departmentId || user.department.id === departmentId)
      );

      // Fetch department tasks
      const tasksResponse = await api.departments.getDepartmentTasks(departmentId);
      
      // Fetch department aims - using the with-progress endpoint
      let aimsResponse = { success: true, data: [] };
      try {
        const aimsData = await api.aims.getAimsWithProgress({
          department: departmentId,
          date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
        });
        aimsResponse = aimsData.success ? aimsData : { success: true, data: Array.isArray(aimsData) ? aimsData : [] };
      } catch (aimsError) {
        console.warn("Could not fetch aims for department:", aimsError);
        // Continue without aims data
        aimsResponse = { success: false, data: [] };
      }

      // Calculate department statistics
      const stats = calculateDepartmentStats(departmentUsers, tasksResponse, aimsResponse.data);

      setDepartmentData({
        users: departmentUsers,
        tasks: tasksResponse,
        aims: aimsResponse.data,
        stats
      });

    } catch (error) {
      console.error("Error fetching department details:", error);
      toast({
        title: "Error",
        description: "Failed to load department details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDepartmentStats = (users, tasks, aims) => {
    const totalUsers = users.length;
    const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
    const totalAims = Array.isArray(aims) ? aims.length : 0;
    
    // Task statistics
    const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'Completed').length : 0;
    const inProgressTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'In Progress').length : 0;
    const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'Pending').length : 0;
    
    // Aim statistics
    const completedAims = Array.isArray(aims) ? aims.filter(aim => aim.completionStatus === 'Completed').length : 0;
    const pendingAims = Array.isArray(aims) ? aims.filter(aim => aim.isPending).length : 0;
    const aimsWithProgress = Array.isArray(aims) ? aims.filter(aim => !aim.isPending).length : 0;
    
    // Attendance statistics (from aims data)
    const presentUsers = Array.isArray(aims) ? aims.filter(aim => 
      aim.workSessionInfo && aim.workSessionInfo.startDayTime
    ).length : 0;
    
    return {
      totalUsers,
      totalTasks,
      totalAims,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completedAims,
      pendingAims,
      aimsWithProgress,
      presentUsers,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      aimCompletionRate: totalAims > 0 ? Math.round((completedAims / totalAims) * 100) : 0,
      attendanceRate: totalUsers > 0 ? Math.round((presentUsers / totalUsers) * 100) : 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500";
      case "Pending":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500";
      case "Medium":
        return "bg-amber-500/10 text-amber-500";
      case "Low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

    if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading department details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black space-y-8 font-poppins p-4 md:p-6 lg:p-8">
      {/* Enhanced Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Electric Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-60 left-40 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-70"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Enhanced Header */}
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
              <div className="absolute top-12 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-70"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                {/* Back Button */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onBack}
                    className="relative bg-white/10 backdrop-blur-md border border-white/30 hover:border-cyan-400/50 text-white hover:text-cyan-300 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
                
                {/* Department Info */}
                <div className="flex items-center gap-4">
                  {/* Enhanced Department Color Indicator */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-2xl blur-sm"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-2xl flex items-center justify-center shadow-xl">
                      <div 
                        className="w-8 h-8 rounded-xl shadow-inner" 
                        style={{ 
                          backgroundColor: department.color,
                          boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 0 20px ${department.color}60`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-2">
                      {department.name}
                    </h1>
                    <p className="text-lg text-cyan-200/80 font-medium">
                      {department.description || "Department overview and analytics"}
                    </p>
                    <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-70 mt-2"></div>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-pink-500/40 rounded-xl blur-sm"></div>
                <Button 
                  variant="outline" 
                  onClick={fetchDepartmentDetails}
                  className="relative bg-white/10 backdrop-blur-md border border-white/30 hover:border-purple-400/50 text-white hover:text-purple-300 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Team Members Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 hover:scale-[1.02] p-6 h-full">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white/90">Team Members</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-cyan-300" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{departmentData.stats.totalUsers}</div>
                <p className="text-sm text-cyan-200/80">
                  {departmentData.stats.presentUsers} present today ({departmentData.stats.attendanceRate}%)
                </p>
              </div>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 hover:scale-[1.02] p-6 h-full">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white/90">Tasks</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-cyan-300" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{departmentData.stats.totalTasks}</div>
                <p className="text-sm text-cyan-200/80">
                  {departmentData.stats.completedTasks} completed ({departmentData.stats.taskCompletionRate}%)
                </p>
              </div>
            </div>
          </div>

          {/* Daily Aims Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 hover:scale-[1.02] p-6 h-full">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white/90">Daily Aims</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-cyan-300" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{departmentData.stats.totalAims}</div>
                <p className="text-sm text-cyan-200/80">
                  {departmentData.stats.completedAims} completed ({departmentData.stats.aimCompletionRate}%)
                </p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-black/30 border border-white/20 rounded-2xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-500 hover:border-cyan-400/40 hover:scale-[1.02] p-6 h-full">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white/90">Progress</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-cyan-300" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{departmentData.stats.aimsWithProgress}</div>
                <p className="text-sm text-cyan-200/80">
                  Aims with progress updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Detailed Tabs */}
        <div className="relative">
          {/* Tab Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 rounded-2xl blur-xl opacity-60"></div>
          
          <Tabs defaultValue="users" className="relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl shadow-xl p-6">
            {/* Enhanced Tab List */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-xl blur-sm"></div>
              <TabsList className="relative grid w-full max-w-md grid-cols-3 mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-300"
                >
                  Team Members
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-300"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger 
                  value="aims"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-300"
                >
                  Daily Aims
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users" className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent rounded-xl"></div>
                <div className="relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-xl shadow-lg p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-cyan-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Team Members ({departmentData.users.length})
                      </h3>
                      <p className="text-cyan-200/70">All members in this department</p>
                    </div>
                  </div>

                  {departmentData.users.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-cyan-300/60" />
                      </div>
                      <p className="text-white/70 font-medium">No team members found in this department.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10">
                              <TableHead className="text-cyan-200 font-semibold">Name</TableHead>
                              <TableHead className="text-cyan-200 font-semibold">Email</TableHead>
                              <TableHead className="text-cyan-200 font-semibold">Role</TableHead>
                              <TableHead className="text-cyan-200 font-semibold">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {departmentData.users.map((user) => {
                              const userAim = departmentData.aims.find(aim => aim.user && aim.user._id === user._id);
                              const isPresent = userAim && userAim.workSessionInfo && userAim.workSessionInfo.startDayTime;
                              
                              return (
                                <TableRow key={user._id} className="border-white/10 hover:bg-white/10 transition-colors duration-300">
                                  <TableCell className="font-medium text-white">{user.name}</TableCell>
                                  <TableCell className="text-white/80">{user.email}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">{user.role}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={isPresent ? "bg-green-500/20 text-green-300 border border-green-400/30" : "bg-gray-500/20 text-gray-300 border border-gray-400/30"}>
                                      {isPresent ? "Present" : "Absent"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <div className="relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl overflow-hidden">
            {/* Electric Particles Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>

            <div className="relative p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Department Tasks ({departmentData.tasks.length})
                </h3>
                <p className="text-white/70 mt-1">All tasks assigned to this department</p>
              </div>

              {departmentData.tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
                    <CheckCircle className="mx-auto h-12 w-12 text-cyan-400/60 mb-4" />
                    <p className="text-white/70">No tasks found for this department.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="text-cyan-300 font-semibold">Title</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Assignee</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Status</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Priority</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Progress</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentData.tasks.map((task) => (
                          <TableRow key={task._id} className="border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <TableCell className="font-medium text-white">{task.title}</TableCell>
                            <TableCell className="text-white/80">{task.assignee?.name || "Unassigned"}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={task.progress || 0} className="w-16 h-2" />
                                <span className="text-xs text-white/70">{task.progress || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white/80">
                              {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aims" className="mt-6">
          <div className="relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl overflow-hidden">
            {/* Electric Particles Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10"></div>
            <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-cyan-400/20 rounded-full blur-2xl animate-pulse animation-delay-1500"></div>

            <div className="relative p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Today's Aims ({departmentData.aims.length})
                </h3>
                <p className="text-white/70 mt-1">Daily objectives set by team members</p>
              </div>

              {departmentData.aims.length === 0 ? (
                <div className="text-center py-12">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
                    <Target className="mx-auto h-12 w-12 text-cyan-400/60 mb-4" />
                    <p className="text-white/70">No aims set for today in this department.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentData.aims.map((aim) => (
                    <div key={aim._id} className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden group hover:bg-white/10 transition-all duration-300">
                      {/* Small Electric Particle */}
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white">
                            {aim.user?.name || "Unknown User"}
                          </span>
                          
                          {/* Work Location Tag */}
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 backdrop-blur-sm bg-white/10 border border-white/20 text-cyan-300`}>
                            <MapPin className="h-3 w-3" />
                            {aim.workSessionInfo?.workLocationTag || aim.workLocation || 'Office'}
                          </span>
                          
                          {/* Progress Percentage */}
                          {aim.progressPercentage > 0 && (
                            <span className="px-2 py-1 text-xs backdrop-blur-sm bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full">
                              {aim.progressPercentage}% Progress
                            </span>
                          )}
                          
                          {/* Status */}
                          <Badge className={aim.isPending ? "bg-orange-500/20 text-orange-300 border border-orange-400/30" : "bg-green-500/20 text-green-300 border border-green-400/30"}>
                            {aim.isPending ? "Pending Progress" : aim.completionStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="h-3 w-3" />
                          <span>Set at {format(new Date(aim.createdAt), "h:mm a")}</span>
                        </div>
                      </div>

                      {/* Aim Content */}
                      <div className="mb-3">
                        <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
                          {aim.aims}
                        </p>
                      </div>

                      {/* Progress Information */}
                      {aim.progressEntries && aim.progressEntries.length > 0 ? (
                        <div className="mt-3 p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
                          <h4 className="text-xs font-semibold text-cyan-300 mb-2">
                            Progress Updates ({aim.progressEntries.length})
                          </h4>
                          {aim.progressEntries.slice(0, 2).map((entry) => (
                            <div key={entry._id} className="mb-2 text-xs">
                              {entry.notes && (
                                <div className="text-white/80">
                                  <span className="font-medium text-cyan-300">Notes:</span> {entry.notes}
                                </div>
                              )}
                              {entry.achievements && (
                                <div className="text-green-300">
                                  <span className="font-medium">Achievements:</span> {entry.achievements}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 p-3 backdrop-blur-sm bg-orange-500/10 border border-orange-400/20 rounded-lg">
                          <p className="text-xs text-orange-300">No progress updates yet</p>
                        </div>
                      )}

                      {/* Work Session Info */}
                      {aim.workSessionInfo && aim.workSessionInfo.startDayTime && (
                        <div className="mt-3 p-3 backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-lg">
                          <h4 className="text-xs font-semibold text-blue-300 mb-1">Work Session</h4>
                          <div className="text-xs text-blue-200">
                            Started: {format(new Date(aim.workSessionInfo.startDayTime), "h:mm a")}
                            {aim.workSessionInfo.totalHoursWorked > 0 && (
                              <span className="ml-2">• {aim.workSessionInfo.totalHoursWorked}h worked</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
      </div>
    </div>
  );
}