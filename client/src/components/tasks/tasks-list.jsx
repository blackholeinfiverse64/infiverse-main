"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
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
import { MoreHorizontal, Eye, Edit, Trash, Loader2, Search, X, ListTodo } from 'lucide-react'
import { TaskDetailsDialog } from "./task-details-dialog"
import { useToast } from "../../hooks/use-toast"
import { api } from "../../lib/api"
import { useSocketContext } from "../../context/socket-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditTaskDialog({ task, open, onOpenChange }) {
  // const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update formData when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.tasks.updateTask(task._id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      });
      toast.success("Task updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.message || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="dialog-overlay">
      <DialogContent className="sm:max-w-[525px] backdrop-blur-xl bg-black/90 border border-white/20 shadow-2xl">
        {/* Electric Particles Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10 rounded-lg"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>

        <div className="relative">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Edit Task
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="title" className="text-cyan-300 font-medium">Title</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="relative bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/30"
                  />
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="description" className="text-cyan-300 font-medium">Description</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="relative bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/30"
                  />
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="status" className="text-cyan-300 font-medium">Status</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="relative bg-white/5 border-white/20 text-white focus:border-cyan-400/50 focus:ring-cyan-400/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-black/90 border-white/20">
                      <SelectItem value="Pending" className="text-white hover:bg-white/10">Pending</SelectItem>
                      <SelectItem value="In Progress" className="text-white hover:bg-white/10">In Progress</SelectItem>
                      <SelectItem value="Completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="priority" className="text-cyan-300 font-medium">Priority</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger className="relative bg-white/5 border-white/20 text-white focus:border-cyan-400/50 focus:ring-cyan-400/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-black/90 border-white/20">
                      <SelectItem value="Low" className="text-white hover:bg-white/10">Low</SelectItem>
                      <SelectItem value="Medium" className="text-white hover:bg-white/10">Medium</SelectItem>
                      <SelectItem value="High" className="text-white hover:bg-white/10">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="dueDate" className="text-cyan-300 font-medium">Due Date</Label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="relative bg-white/5 border-white/20 text-white focus:border-cyan-400/50 focus:ring-cyan-400/30"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-8 gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-lg blur-sm"></div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="relative bg-white/5 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-lg blur-sm"></div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TasksList({ filters }) {
  const { toast } = useToast()
  const { events } = useSocketContext()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch tasks based on filters
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const data = await api.tasks.getTasks(filters)
        setTasks(data)
        setError(null)
      } catch (err) {
        setError(err.message || "Failed to load tasks")
        toast({
          title: "Error",
          description: err.message || "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [filters, toast])

  // Handle socket events for real-time updates
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]

      // Apply filter checks for socket updates
      const matchesFilters = (task) => {
        const { status, department, priority } = filters
        return (
          (!status?.length || status.includes(task.status)) &&
          (!department?.length || department.includes(task.department?._id)) &&
          (!priority || priority === "all" || task.priority === priority)
        )
      }

      if (latestEvent.type === "task-created" && matchesFilters(latestEvent.data)) {
        setTasks((prev) => [...prev, latestEvent.data])
      } else if (latestEvent.type === "task-updated") {
        setTasks((prev) =>
          prev
            .map((task) => (task._id === latestEvent.data._id ? latestEvent.data : task))
            .filter(matchesFilters)
        )
      } else if (latestEvent.type === "task-deleted") {
        setTasks((prev) => prev.filter((task) => task._id !== latestEvent.data._id))
      }
    }
  }, [events, filters])

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks
    }

    const query = searchQuery.toLowerCase().trim()
    return tasks.filter((task) => {
      // Search in task title
      const titleMatch = task.title?.toLowerCase().includes(query)
      
      // Search in assignee name
      const assigneeMatch = task.assignee?.name?.toLowerCase().includes(query)
      
      // Search in department name
      const departmentMatch = task.department?.name?.toLowerCase().includes(query)
      
      // Search in task description
      const descriptionMatch = task.description?.toLowerCase().includes(query)

      return titleMatch || assigneeMatch || departmentMatch || descriptionMatch
    })
  }, [tasks, searchQuery])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Pending":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "Low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const handleViewTask = (task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsEditOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        setIsDeleting(true);
        await api.tasks.deleteTask(taskId);
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error(error.message || "Failed to delete task");
      } finally {
        setIsDeleting(false);
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  // Group filtered tasks by department
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const deptName = task.department?.name || "Unknown"
    if (!acc[deptName]) {
      acc[deptName] = []
    }
    acc[deptName].push(task)
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl">
        {/* Enhanced Universe Particles */}
        <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
        {/* Floating Universe Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping opacity-75"></div>
        </div>

        <div className="relative p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Tasks by Department
            </h3>
            <p className="text-white/70 mt-1">View tasks grouped by department</p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full blur-lg animate-pulse"></div>
                <Loader2 className="relative h-12 w-12 animate-spin text-cyan-400" />
              </div>
              <p className="text-white/80 text-lg">Loading tasks...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl">
        {/* Enhanced Universe Particles */}
        <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
        {/* Floating Universe Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-red-400/80 rounded-full animate-ping opacity-75"></div>
        </div>

        <div className="relative p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Tasks by Department
            </h3>
            <p className="text-white/70 mt-1">View tasks grouped by department</p>
          </div>

          <div className="text-center py-12">
            <div className="backdrop-blur-sm bg-red-500/10 border border-red-400/20 rounded-2xl p-8 inline-block">
              <p className="text-red-300 text-lg mb-4">Error loading tasks: {error}</p>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/40 to-orange-500/40 rounded-xl blur-sm"></div>
                <Button
                  variant="outline"
                  className="relative bg-white/10 backdrop-blur-md border border-white/30 hover:border-red-400/50 text-white hover:text-red-300 transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30">
        {/* Enhanced Universe Particles */}
        <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
        {/* Floating Universe Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-blue-400/70 rounded-full animate-pulse opacity-60"></div>
        </div>

        <div className="relative p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Search Tasks
            </h3>
            <p className="text-white/70 mt-1">Search by task name, assignee, department, or description</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl blur-sm"></div>
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5" />
              <Input
                placeholder="Search tasks by name, user, department, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 bg-transparent border-0 text-white placeholder:text-white/50 focus:ring-2 focus:ring-cyan-400/50 h-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10 text-white/70 hover:text-cyan-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-cyan-300/80">
              Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Empty/No Results State */}
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl">
          {/* Enhanced Universe Particles */}
          <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/80 rounded-full animate-ping opacity-75"></div>
          </div>

          <div className="relative p-12">
            <div className="text-center">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
                {searchQuery ? (
                  <div>
                    <Search className="mx-auto h-16 w-16 text-cyan-400/60 mb-4" />
                    <p className="text-white/80 text-lg mb-4">No tasks found matching your search criteria.</p>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
                      <Button 
                        variant="outline" 
                        onClick={clearSearch} 
                        className="relative bg-white/10 backdrop-blur-md border border-white/30 hover:border-cyan-400/50 text-white hover:text-cyan-300 transition-all duration-300 hover:scale-105"
                      >
                        Clear search
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ListTodo className="mx-auto h-16 w-16 text-cyan-400/60 mb-4" />
                    <p className="text-white/80 text-lg">No tasks found matching the selected filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([deptName, deptTasks]) => (
          <div key={deptName} className="relative backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 group">
            {/* Enhanced Universe Particles inside Department Task Card */}
            <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
            <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
            <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
            {/* Floating Universe Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
              <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400/70 rounded-full animate-pulse opacity-60 group-hover:opacity-100"></div>
            </div>

            <div className="relative">
              {/* Enhanced Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                      {deptName} Tasks
                    </h3>
                    <p className="text-white/70 mt-1">Tasks assigned to the {deptName} department</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-xl blur-sm"></div>
                    <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                      <span className="text-cyan-300 font-semibold">{deptTasks.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="text-cyan-300 font-semibold">Title</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Assignee</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Status</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Priority</TableHead>
                          <TableHead className="text-cyan-300 font-semibold">Due Date</TableHead>
                          <TableHead className="text-cyan-300 font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deptTasks.map((task) => (
                          <TableRow key={task._id} className="border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{task.title}</div>
                                {task.description && (
                                  <div className="text-sm text-white/60 truncate max-w-xs">
                                    {task.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-white/80">{task.assignee?.name || "Unassigned"}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            </TableCell>
                            <TableCell className="text-white/80">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-cyan-400 hover:bg-white/10">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="backdrop-blur-xl bg-black/80 border border-white/20 shadow-2xl rounded-xl"
                                >
                                  <DropdownMenuLabel className="font-medium text-cyan-300">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleViewTask(task)}
                                    className="text-white/80 hover:bg-white/10 hover:text-cyan-300 focus:bg-white/10 focus:text-cyan-300"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditTask(task)}
                                    className="text-white/80 hover:bg-white/10 hover:text-cyan-300 focus:bg-white/10 focus:text-cyan-300"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit task
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/20" />
                                  <DropdownMenuItem
                                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300"
                                    onClick={() => handleDeleteTask(task._id)}
                                    disabled={isDeleting}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      {selectedTask && (
        <>
          <TaskDetailsDialog
            task={selectedTask}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <EditTaskDialog
            task={selectedTask}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
        </>
      )}
    </div>
  )
}

<ToastContainer />