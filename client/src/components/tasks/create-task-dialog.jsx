import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import api, { API_URL } from "@/lib/api";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { isValid, parse } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/auth-context";
import { getUserTasks } from "@/lib/user-api";

export function CreateTaskDialog({ open, onOpenChange }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [loadingUserTasks, setLoadingUserTasks] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    assignee: "",
    priority: "Medium",
    status: "Pending",
    dependencies: [],
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        department: "",
        assignee: "",
        priority: "Medium",
        status: "Pending",
        dependencies: [],
      });
      setDueDate("");
      setDocumentFile(null);
      setDateError("");
      setFilteredUsers([]);
      setAssigneeSearch("");
      setSelectedUserTasks([]);
      setLoadingUserTasks(false);

      const fetchData = async () => {
        try {
          const [departmentsResponse, usersResponse, tasksResponse] = await Promise.all([
            api.departments.getDepartments(),
            api.users.getUsers(),
            api.tasks.getTasks(),
          ]);

          let departmentsData = [];
          if (Array.isArray(departmentsResponse)) {
            departmentsData = departmentsResponse;
          } else if (departmentsResponse?.success && Array.isArray(departmentsResponse.data)) {
            departmentsData = departmentsResponse.data;
          } else if (departmentsResponse?.data && Array.isArray(departmentsResponse.data)) {
            departmentsData = departmentsResponse.data;
          }

          const filteredUsers = Array.isArray(usersResponse)
            ? usersResponse.filter((user) => user.email && user.email.toLowerCase().startsWith("blackhole"))
            : [];

          setDepartments(departmentsData);
          setAllUsers(filteredUsers);
          setTasks(Array.isArray(tasksResponse) ? tasksResponse : []);

        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load required data");
          setDepartments([]);
          setAllUsers([]);
          setTasks([]);
        }
      };

      fetchData();
    }
  }, [open]);

  const handleDepartmentChange = (departmentId) => {
    setFormData((prev) => ({ ...prev, department: departmentId, assignee: "" }));
    setAssigneeSearch("");
    
    const usersInDepartment = allUsers.filter(
      (user) => user.department?._id === departmentId && user.stillExist === 1
    );
    setFilteredUsers(usersInDepartment);
  };

  const handleAssigneeSearch = (e) => {
    const searchValue = e.target.value;
    setAssigneeSearch(searchValue);
    
    const usersInDepartment = allUsers.filter(
      (user) =>
        user.department?._id === formData.department &&
        user.stillExist === 1 &&
        user.email.toLowerCase().startsWith("blackhole")
    );
    
    if (searchValue.trim() === "") {
      setFilteredUsers(usersInDepartment);
    } else {
      const filtered = usersInDepartment.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAssigneeSelect = async (user) => {
    setFormData((prev) => ({ ...prev, assignee: user._id }));
    setAssigneeSearch(user.name);
    setFilteredUsers([]);
    await fetchUserTasks(user._id);
  };

  const fetchUserTasks = async (userId) => {
    setLoadingUserTasks(true);
    try {
      const tasks = await getUserTasks(userId);
      setSelectedUserTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      setSelectedUserTasks([]);
    } finally {
      setLoadingUserTasks(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDueDate(value);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      setDateError("Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    const parsedDate = parse(value, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) {
      setDateError("Invalid date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      setDateError("Due date cannot be in the past");
      return;
    }

    setDateError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setDocumentFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Please enter a task title");
        return;
      }

      if (!formData.department) {
        toast.error("Please select a department");
        return;
      }

      if (!formData.assignee) {
        toast.error("Please select an assignee");
        return;
      }

      if (dateError) {
        toast.error("Please fix the date error");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("links", formData.links || "");
      formDataToSend.append("department", formData.department);
      formDataToSend.append("assignee", formData.assignee);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("dueDate", dueDate || "");
      formDataToSend.append("createdBy", user._id);

      if (formData.dependencies.length > 0) {
        formDataToSend.append("dependencies", JSON.stringify(formData.dependencies));
      }

      if (documentFile) {
        formDataToSend.append("document", documentFile);
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      const result = await response.json();
      console.log("Task created successfully:", result);

      toast.success("Task created successfully");
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="dialog-overlay">
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-hidden bg-black/20 backdrop-blur-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/40 rounded-3xl">
        {/* Enhanced Glassmorphism Header with White Menu Bar */}
        

        {/* Enhanced Glassmorphism Form */}
        <div className="relative p-8 space-y-8 max-h-[65vh] overflow-y-auto">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-cyan-900/15 to-blue-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.15),transparent_50%)]"></div>
          
          {/* Form Content */}
          <div className="relative z-10 space-y-8">
            {/* Task Title - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-lg"></div>
                <Label htmlFor="title" className="text-white font-bold text-xl drop-shadow-lg">
                  Task Title <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="Enter descriptive task title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="relative h-14 bg-black/30 backdrop-blur-xl border border-cyan-500/40 text-white text-lg placeholder:text-gray-300 focus:border-cyan-400/80 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 rounded-2xl shadow-lg shadow-cyan-500/20"
                />
              </div>
            </div>

            {/* Description - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
                <Label htmlFor="description" className="text-white font-bold text-xl drop-shadow-lg">Description</Label>
              </div>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Provide detailed task description and requirements"
                  className="relative min-h-[140px] bg-black/30 backdrop-blur-xl border border-blue-500/40 text-white text-lg placeholder:text-gray-300 focus:border-blue-400/80 focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 resize-none rounded-2xl shadow-lg shadow-blue-500/20"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </div>

            {/* Links - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full shadow-lg"></div>
                <Label htmlFor="links" className="text-white font-bold text-xl drop-shadow-lg">Reference Links</Label>
              </div>
              <div className="relative">
                <Input
                  id="links"
                  placeholder="Add relevant links (comma-separated)"
                  value={formData.links}
                  onChange={(e) => handleChange("links", e.target.value)}
                  className="relative h-14 bg-black/30 backdrop-blur-xl border border-purple-500/40 text-white text-lg placeholder:text-gray-300 focus:border-purple-400/80 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 rounded-2xl shadow-lg shadow-purple-500/20"
                />
              </div>
            </div>

            {/* Department and Assignee - Enhanced Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Department */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full shadow-lg"></div>
                  <Label htmlFor="department" className="text-white font-bold text-xl drop-shadow-lg">
                    Department <span className="text-red-400">*</span>
                  </Label>
                </div>
                <div className="relative">
                  <Select
                    value={formData.department}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger id="department" className="relative h-14 bg-black/30 backdrop-blur-xl border border-emerald-500/40 text-white text-lg focus:border-emerald-400/80 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 rounded-2xl shadow-lg shadow-emerald-500/20">
                      <SelectValue 
                        placeholder={
                          Array.isArray(departments) && departments.length > 0 
                            ? "Select department" 
                            : "Loading departments..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-black/40 backdrop-blur-xl border border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-500/20">
                      {Array.isArray(departments) && departments.length > 0 && 
                        departments.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id} className="text-white text-lg hover:bg-emerald-500/20 focus:bg-emerald-500/20 rounded-xl py-3 cursor-pointer transition-all duration-200">
                            {dept.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                {Array.isArray(departments) && departments.length === 0 && (
                  <p className="text-sm text-emerald-300 flex items-center gap-2 bg-emerald-900/20 px-3 py-2 rounded-xl border border-emerald-500/30 backdrop-blur-xl">
                    <div className="w-4 h-4 border-2 border-emerald-400/40 border-t-emerald-500 rounded-full animate-spin"></div>
                    Loading departments...
                  </p>
                )}
              </div>

              {/* Assignee */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full shadow-lg"></div>
                  <Label htmlFor="assignee-search" className="text-white font-bold text-xl drop-shadow-lg">
                    Assignee <span className="text-red-400">*</span>
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="assignee-search"
                    placeholder="Search for assignees..."
                    value={assigneeSearch}
                    onChange={handleAssigneeSearch}
                    disabled={!formData.department}
                    className="relative h-14 bg-black/30 backdrop-blur-xl border border-orange-500/40 text-white text-lg placeholder:text-gray-300 focus:border-orange-400/80 focus:ring-4 focus:ring-orange-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-orange-500/20"
                  />
                </div>
                
                {/* Enhanced User Dropdown */}
                {filteredUsers.length > 0 && formData.department && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl blur-sm"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/50 rounded-2xl max-h-64 overflow-y-auto shadow-xl">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="px-6 py-4 hover:bg-orange-500/20 cursor-pointer flex items-center justify-between border-b border-orange-500/30 last:border-b-0 transition-all duration-300 hover:shadow-md first:rounded-t-2xl last:rounded-b-2xl"
                          onClick={() => handleAssigneeSelect(user)}
                        >
                          <span className="text-white font-semibold text-lg drop-shadow-lg">{user.name}</span>
                          <span className="text-sm bg-green-100/90 text-green-700 px-4 py-2 rounded-full border border-green-200/60 shadow-sm font-medium">
                            ✓ Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.department && filteredUsers.length === 0 && assigneeSearch && !formData.assignee && (
                  <div className="px-6 py-4 text-lg text-red-300 bg-red-900/30 border border-red-500/60 rounded-2xl backdrop-blur-xl">
                    No active users found in this department
                  </div>
                )}
              </div>
            </div>

            {/* Priority and Due Date - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Priority */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full shadow-lg"></div>
                  <Label htmlFor="priority" className="text-white font-bold text-xl drop-shadow-lg">Priority Level</Label>
                </div>
                <div className="relative">
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger id="priority" className="relative h-14 bg-black/30 backdrop-blur-xl border border-yellow-500/40 text-white text-lg focus:border-yellow-400/80 focus:ring-4 focus:ring-yellow-400/30 transition-all duration-300 rounded-2xl shadow-lg shadow-yellow-500/20">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/40 backdrop-blur-xl border border-yellow-500/50 rounded-2xl shadow-2xl">
                      <SelectItem value="High" className="text-white text-lg hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl py-3">
                        <span className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                          High Priority
                        </span>
                      </SelectItem>
                      <SelectItem value="Medium" className="text-white text-lg hover:bg-yellow-500/20 focus:bg-yellow-500/20 rounded-xl py-3">
                        <span className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                          Medium Priority
                        </span>
                      </SelectItem>
                      <SelectItem value="Low" className="text-white text-lg hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl py-3">
                        <span className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                          Low Priority
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full shadow-lg"></div>
                  <Label htmlFor="dueDate" className="text-white font-bold text-xl drop-shadow-lg">Due Date</Label>
                </div>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={handleDateChange}
                    className={cn(
                      "relative h-14 bg-black/30 backdrop-blur-xl border text-white text-lg focus:ring-4 transition-all duration-300 rounded-2xl shadow-lg shadow-pink-500/20",
                      dateError 
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/30" 
                        : "border-pink-500/40 focus:border-pink-400/80 focus:ring-pink-400/30"
                    )}
                  />
                </div>
                {dateError && (
                  <p className="text-sm text-red-300 flex items-center gap-3 bg-red-900/30 px-4 py-3 rounded-xl border border-red-500/60 backdrop-blur-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {dateError}
                  </p>
                )}
              </div>
            </div>

            {/* Document Upload - Enhanced */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full shadow-lg"></div>
                <Label htmlFor="document" className="text-white font-bold text-xl drop-shadow-lg">Attach Document</Label>
              </div>
              <div className="relative">
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.html"
                  onChange={handleFileChange}
                  className="relative h-14 bg-black/30 backdrop-blur-xl border border-teal-500/40 text-white text-lg file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-lg file:font-semibold file:bg-teal-500/30 file:text-white hover:file:bg-teal-500/40 focus:border-teal-400/70 focus:ring-4 focus:ring-teal-400/30 transition-all duration-300 rounded-2xl shadow-lg shadow-teal-500/20"
                />
              </div>
              {documentFile && (
                <p className="text-lg text-teal-300 flex items-center gap-3 bg-teal-900/30 px-5 py-4 rounded-2xl border border-teal-500/60 shadow-sm backdrop-blur-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Selected: <span className="font-bold">{documentFile.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Glassmorphism Footer */}
        <DialogFooter className="relative p-8 bg-gradient-to-r from-black/30 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl border-t border-cyan-500/40 rounded-b-3xl">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_70%)]"></div>
          
          {/* Footer Buttons */}
          <div className="relative z-10 flex items-center justify-end gap-8 w-full">
            {/* Cancel Button - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="relative h-14 px-10 bg-black/40 backdrop-blur-xl border border-gray-500/60 text-white text-lg font-semibold hover:bg-black/50 hover:border-gray-400/70 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl shadow-gray-500/20"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Button>
            </div>

            {/* Create Button - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-blue-500/50 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500"></div>
              <Button 
                type="submit" 
                onClick={handleSubmit} 
                disabled={isLoading || dateError}
                className="relative h-14 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 text-white text-lg font-bold shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating Task...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute bottom-8 left-8 w-3 h-3 bg-cyan-400/80 rounded-full animate-bounce delay-200"></div>
          <div className="absolute top-8 right-16 w-2 h-2 bg-blue-500/80 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-12 right-32 w-1 h-1 bg-purple-500/80 rounded-full animate-pulse delay-500"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}