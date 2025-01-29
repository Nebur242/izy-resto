import React from 'react';

interface DashboardPageWrapperProps {
  children: React.ReactNode;
}

export function DashboardPageWrapper({ children }: DashboardPageWrapperProps) {
  return <div className="py-6 md:py-8">{children}</div>;
}
