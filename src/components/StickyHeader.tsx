import { useState, useEffect } from 'react'
import { MizuConnectButton } from './ConnectButton'

export const StickyHeader = () => {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Get all sections
      const sections = ['hero', 'innovations', 'performance', 'advantages', 'markets']
      const sectionElements = sections.map(id => document.getElementById(id))

      // Find which section is currently in view (accounting for header height)
      const headerOffset = 120
      const currentSection = sectionElements.find(section => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= headerOffset && rect.bottom > headerOffset
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
      const headerHeight = 120 // Approximate header height including mobile nav
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Close mobile menu after navigation
      setMobileMenuOpen(false)
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
              isScrolled ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'
            }`}
          />
          <img
            src="/logoText.png"
            alt="MizuPass"
            className={`object-contain transition-all duration-300 ${
              isScrolled ? 'h-4' : 'h-5 sm:h-6'
            }`}
          />
        </button>

        {/* Desktop Navigation */}
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

        {/* Mobile & Desktop Right Side */}
        <div className="flex items-center gap-3">
          {/* Desktop Connect Button */}
          <div className={`hidden md:block transition-all duration-300 ${
            isScrolled ? 'scale-90' : 'scale-100'
          }`}>
            <MizuConnectButton />
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <div className={`w-4 h-0.5 bg-gray-600 transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
              <div className={`w-4 h-0.5 bg-gray-600 transition-all duration-200 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-4 h-0.5 bg-gray-600 transition-all duration-200 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
          {/* Mobile Navigation Links */}
          <nav className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Connect Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="scale-90">
              <MizuConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}