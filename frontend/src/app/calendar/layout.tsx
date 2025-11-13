
import React from 'react';

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

export default CalendarLayout;
