"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Building, Palette, User, FileText, Sparkles } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { api } from "../../lib/api"

export function CreateDepartmentDialog({ open, onOpenChange }) {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lead: "",
    color: "bg-blue-500",
  })

  // Fetch users when dialog opens
  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const usersData = await api.users.getUsers()
          setUsers(usersData)
        } catch (error) {
          console.error("Error fetching users:", error)
          toast({
            title: "Error",
            description: "Failed to load users",
            variant: "destructive",
          })
        }
      }

      fetchUsers()
    }
  }, [open, toast])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleColorSelect = (color) => {
    handleChange("color", color)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.lead) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await api.departments.createDepartment({
        ...formData,
        members: [formData.lead], // Initially add the lead as a member
      })

      toast({
        title: "Success",
        description: "Department created successfully",
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        lead: "",
        color: "bg-blue-500",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error creating department:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative backdrop-blur-xl bg-black/80 border border-white/20 shadow-2xl max-w-md mx-auto rounded-2xl overflow-hidden">
        {/* Electric Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-20 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute bottom-12 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-70"></div>
        </div>

        <div className="relative">
          {/* Enhanced Header */}
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-cyan-300" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create New Department
                </DialogTitle>
                <DialogDescription className="text-cyan-200/80 text-sm mt-1">
                  Add a new department to your workflow management system
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {/* Enhanced Form Fields */}
          <div className="space-y-6">
            {/* Department Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                Department Name <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur-sm"></div>
                <Input
                  id="name"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/30 transition-all duration-300"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                Description
              </Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur-sm"></div>
                <Textarea
                  id="description"
                  placeholder="Enter department description"
                  className="relative min-h-[100px] bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/30 transition-all duration-300 resize-none"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </div>

            {/* Department Lead Field */}
            <div className="space-y-2">
              <Label htmlFor="lead" className="text-white font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                Department Lead <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur-sm"></div>
                <Select value={formData.lead} onValueChange={(value) => handleChange("lead", value)}>
                  <SelectTrigger 
                    id="lead"
                    className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white focus:border-cyan-400/50 focus:ring-cyan-400/30 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select department lead" className="text-white/50" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-md bg-black/80 border border-white/20">
                    {users.map((user) => (
                      <SelectItem 
                        key={user.id} 
                        value={user.id}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department Color Field */}
            <div className="space-y-3">
              <Label htmlFor="color" className="text-white font-medium flex items-center gap-2">
                <Palette className="h-4 w-4 text-cyan-400" />
                Department Color
              </Label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: "bg-blue-500", color: "#3b82f6" },
                  { value: "bg-green-500", color: "#10b981" },
                  { value: "bg-amber-500", color: "#f59e0b" },
                  { value: "bg-red-500", color: "#ef4444" },
                  { value: "bg-purple-500", color: "#a855f7" },
                  { value: "bg-cyan-500", color: "#06b6d4" },
                  { value: "bg-indigo-500", color: "#6366f1" },
                ].map((colorOption) => (
                  <div key={colorOption.value} className="relative">
                    <div className={`absolute inset-0 rounded-full blur-sm ${
                      formData.color === colorOption.value ? 'opacity-60' : 'opacity-0'
                    } transition-opacity duration-300`} style={{ backgroundColor: colorOption.color }}></div>
                    <button
                      type="button"
                      onClick={() => handleColorSelect(colorOption.value)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        formData.color === colorOption.value
                          ? 'border-white shadow-lg scale-110'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                      style={{ 
                        backgroundColor: colorOption.color,
                        boxShadow: formData.color === colorOption.value 
                          ? `0 0 20px ${colorOption.color}60, inset 0 2px 4px rgba(0,0,0,0.3)` 
                          : 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Enhanced Footer */}
          <DialogFooter className="flex gap-3 pt-6 border-t border-white/10">
            {/* Cancel Button */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg blur-sm"></div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="relative px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 backdrop-blur-md rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
            
            {/* Create Button */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 text-white hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-md rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4" />
                    Create Department
                  </>
                )}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
