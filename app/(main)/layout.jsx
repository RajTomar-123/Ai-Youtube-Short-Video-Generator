import React from 'react'
import DashboardProvider from './provider'

const DashboardLayout = ({children}) => {
  return (
    <DashboardProvider>
      <div>
        {/* Common layout UI, like sidebar, navbar, etc. */}
        {children}
      </div>
    </DashboardProvider>
  )
}

export default DashboardLayout
