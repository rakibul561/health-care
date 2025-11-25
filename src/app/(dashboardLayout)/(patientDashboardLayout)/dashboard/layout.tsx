import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* this is a dashboard Layout */}
      {children}
    </div>
  );
}