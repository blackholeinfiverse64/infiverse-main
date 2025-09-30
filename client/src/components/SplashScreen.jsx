import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import blackholeImage from '../assets/blackhole.png'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Mark splash as shown for this session
    sessionStorage.setItem("splashShown", "true")
    
    // Hide splash screen after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      // Always go to login/signup page after splash
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 800) // Wait for fade out animation
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [navigate])

  const handleSkip = () => {
    // Mark splash as shown and go directly to login
    sessionStorage.setItem("splashShown", "true")
    setIsVisible(false)
    
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 300)
  }

  return (
    <div className={`splash-screen universe-background ${!isVisible ? 'fade-out' : ''}`} onClick={handleSkip}>
      {/* Enhanced Universe Background */}
      <div className="universe-particles"></div>
      <div className="universe-particles-medium"></div>
      <div className="universe-particles-large"></div>
      
      {/* Legacy splash particles for additional effect */}
      <div className="splash-background"></div>
      <div className="splash-particles"></div>
      <div className="splash-particles-medium"></div>
      <div className="splash-particles-large"></div>
      
      {/* Main content */}
      <div className="splash-content">
        {/* Black Hole Image */}
        <div className="splash-blackhole-container">
          <div className="blackhole-image-wrapper">
            <img 
              src={blackholeImage} 
              alt="Black Hole" 
              className="blackhole-image"
            />
            <div className="electric-border"></div>
            <div className="electric-glow"></div>
          </div>
        </div>

        {/* Animated tagline */}
        <p className="splash-tagline">
          Where Innovation Meets Infinity
        </p>

        {/* Loading animation */}
        <div className="splash-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>

        {/* Skip button */}
        <button 
          className="splash-skip-btn"
          onClick={handleSkip}
          aria-label="Skip splash screen"
        >
          Click anywhere to skip
        </button>

        {/* Particle system */}
        <div className="splash-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
      </div>
    </div>
  )
}