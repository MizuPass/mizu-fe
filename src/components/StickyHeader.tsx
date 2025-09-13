import { useState, useEffect } from 'react'
import { MizuConnectButton } from './ConnectButton'

export const StickyHeader = () => {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Get all sections
      const sections = ['hero', 'innovations', 'performance', 'advantages', 'markets']
      const sectionElements = sections.map(id => document.getElementById(id))

      // Find which section is currently in view
      const currentSection = sectionElements.find(section => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom > 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Dynamic background opacity based on scroll
  const backgroundOpacity = Math.min(scrollY / 100, 0.95)
  const isScrolled = scrollY > 50

  const navItems = [
    { id: 'innovations', label: 'Innovations' },
    { id: 'performance', label: 'Performance' },
    { id: 'advantages', label: 'Advantages' },
    { id: 'markets', label: 'Markets' }
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/logoMizu.png"
            alt="MizuPass Logo"
            className={`object-contain transition-all duration-300 ${
              isScrolled ? 'w-12 h-12' : 'w-15 h-15 sm:w-20 sm:h-20'
            }`}
          />
          <img
            src="/logoText.png"
            alt="MizuPass"
            className={`object-contain transition-all duration-300 ${
              isScrolled ? 'h-5' : 'h-6 sm:h-8'
            }`}
          />
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-medium transition-all duration-200 relative ${
                activeSection === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Connect Button */}
        <div className={`transition-all duration-300 ${
          isScrolled ? 'scale-90' : 'scale-100'
        }`}>
          <MizuConnectButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-6 mt-2">
        <div className="flex flex-wrap justify-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-all duration-200 px-3 py-1 rounded-full ${
                activeSection === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}