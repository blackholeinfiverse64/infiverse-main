import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Search, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"

export function DependencyControls() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cyan-400/70" />
          <Input 
            type="search" 
            placeholder="Search tasks..." 
            className="w-full pl-8 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:ring-cyan-400/30" 
          />
        </div>

        <Select>
          <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/20 text-white hover:bg-white/10 focus:ring-cyan-400/30">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-md">
            <SelectItem value="all" className="text-white hover:bg-white/10">All Departments</SelectItem>
            <SelectItem value="marketing" className="text-white hover:bg-white/10">Marketing</SelectItem>
            <SelectItem value="sales" className="text-white hover:bg-white/10">Sales</SelectItem>
            <SelectItem value="operations" className="text-white hover:bg-white/10">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Tabs defaultValue="graph">
          <TabsList className="bg-white/5 border-white/20">
            <TabsTrigger value="graph" className="text-white data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-300">Graph</TabsTrigger>
            <TabsTrigger value="gantt" className="text-white data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-300">Gantt</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/30">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/30">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/30">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
