import * as React from "react"

/**
 * Mobile breakpoint in pixels.
 */
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect if the current viewport is mobile-sized.
 *
 * @returns {boolean} True if the viewport width is less than the mobile breakpoint.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Create the media query
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Function to update state based on media query
    const updateIsMobile = () => {
      setIsMobile(mql.matches)
    }
    
    // Set initial value
    updateIsMobile()
    
    // Add event listener
    mql.addEventListener("change", updateIsMobile)
    
    // Clean up
    return () => {
      mql.removeEventListener("change", updateIsMobile)
    }
  }, [])

  return isMobile
}
