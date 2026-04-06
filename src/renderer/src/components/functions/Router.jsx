import { useState, useEffect, Children } from 'react'
import { match } from 'path-to-regexp'

export function Router({
  children,
  Set,
  Is,
  routes = [],
  defaultComponent: DefaultComponent = () => <h1>404</h1>
}) { 

  // Function to change the current path
  const changePath = (newPath) => {
    Set(newPath)
  }

  let routeParams = {}

  // add routes from children <Route /> components
  const routesFromChildren = Children.map(children, ({ props, type }) => {
    const { name } = type
    const isRoute = name === 'Route'
    return isRoute ? props : null
  })

  const routesToUse = routes.concat(routesFromChildren).filter(Boolean)

  const Page = routesToUse.find(({ path }) => {
    if (path === Is) return true

    // Use path-to-regexp to match dynamic routes
    const matcherUrl = match(path, { decode: decodeURIComponent })
    const matched = matcherUrl(Is)
    if (!matched) return false

    // Save route parameters extracted from dynamic URL
    routeParams = matched.params
    return true
  })?.Component

  // Pass the changePath function as the ROUTER prop
  return Page ? (
    <Page routeParams={routeParams} ROUTER={changePath}  />
  ) : (
    <DefaultComponent routeParams={routeParams} ROUTER={changePath} />
  )
}

// Example Route component to be used as a child of Router
export function Route({ path, Component }) {
  return null
}
