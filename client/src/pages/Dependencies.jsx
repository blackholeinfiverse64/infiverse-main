import { DependencyGraph } from "../components/dependencies/dependency-graph"
import { DependencyControls } from "../components/dependencies/dependency-controls"
import { useSidebar } from "../context/sidebar-context"

function Dependencies() {
  const { isHidden } = useSidebar()
  
  return (
    <div className={`min-h-screen bg-black font-poppins transition-all duration-700 relative overflow-hidden ${
      isHidden 
        ? 'ml-0' 
        : 'ml-80'
    }`}>
      {/* Pure Black Universe Background with Enhanced Moving Particles at 135 Degrees */}
      <div className="fixed inset-0 bg-black z-0"></div>
      <div className="fixed inset-0 universe-particles-135 opacity-50 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-medium-135 opacity-45 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-large-135 opacity-40 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-extra-135 opacity-35 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-tiny-135 opacity-55 pointer-events-none z-1"></div>
      <div className="fixed inset-0 universe-particles-huge-135 opacity-30 pointer-events-none z-1"></div>
      
      <div className="relative z-10 flex flex-col space-y-8 overflow-y-auto p-4 md:p-6 lg:p-8">
        {/* Black Universe Header Card */}
        <div className="relative backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 p-8 bg-black overflow-hidden">
          {/* Enhanced Universe Particles inside Header Card */}
          <div className="absolute inset-0 universe-particles-135 opacity-40 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-45 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-4 right-8 w-2 h-2 bg-cyan-400/80 rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400/70 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-1/2 right-12 w-1.5 h-1.5 bg-purple-400/80 rounded-full animate-bounce opacity-50"></div>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-xl blur-sm"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-md border border-cyan-400/50 rounded-xl flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                  Task Dependencies
                </h1>
                <p className="text-white/80 text-lg mt-2">
                  Visualize and manage task dependencies across departments
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60 mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Black Universe Controls Card */}
        <div className="relative backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 p-6 bg-black overflow-hidden">
          {/* Enhanced Universe Particles inside Controls Card */}
          <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-blue-400/70 rounded-full animate-pulse opacity-60"></div>
          </div>
          
          <div className="relative z-10">
            <DependencyControls />
          </div>
        </div>

        {/* Black Universe Graph Card */}
        <div className="relative backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 hover:border-blue-400/30 p-6 bg-black overflow-hidden flex-1 min-h-[600px]">
          {/* Enhanced Universe Particles inside Graph Card */}
          <div className="absolute inset-0 universe-particles-135 opacity-35 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-medium-135 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 universe-particles-tiny-135 opacity-40 pointer-events-none"></div>
          {/* Floating Universe Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-6 left-8 w-1.5 h-1.5 bg-purple-400/80 rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-8 right-10 w-1 h-1 bg-cyan-400/70 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/80 rounded-full animate-bounce opacity-70"></div>
          </div>
          
          <div className="relative z-10 h-full">
            <DependencyGraph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dependencies
