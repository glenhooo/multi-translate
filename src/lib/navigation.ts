import type { MouseEvent } from "react"

export const ROUTE_CHANGE_EVENT = "multi-translate:navigation"

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}

export function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/"
  }

  return window.location.pathname || "/"
}

export function navigateTo(path: string) {
  if (typeof window === "undefined") {
    return
  }

  const nextPath = normalizePath(path)
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (currentPath !== nextPath) {
    window.history.pushState({}, "", nextPath)
  }

  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}

export function handleRouteLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  path: string
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return
  }

  event.preventDefault()
  navigateTo(path)
}
