import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white flex lg:overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:overflow-hidden">
        <Outlet context={{ sidebarOpen, setSidebarOpen, sidebarCollapsed }} />
      </div>
    </div>
  );
}
