import * as React from "react"

import { HomePage } from "@/components/homepage/home-page"
import { SettingsPage } from "@/components/settings/settings-page"
import { getCurrentPath, ROUTE_CHANGE_EVENT } from "@/lib/navigation"

export function App() {
  const [currentPath, setCurrentPath] = React.useState(() => getCurrentPath())

  React.useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getCurrentPath())
    }

    window.addEventListener("popstate", handleRouteChange)
    window.addEventListener(ROUTE_CHANGE_EVENT, handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleRouteChange)
    }
  }, [])

  if (currentPath === "/settings") {
    return <SettingsPage />
  }

  return <HomePage />
}

export default App
