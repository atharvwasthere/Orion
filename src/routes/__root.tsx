import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <Outlet /> {/* children routes render here */}
    </div>
    </React.Fragment>
  )
}
