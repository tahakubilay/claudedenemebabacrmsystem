
import React from 'react';

const ReceiptsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

export default ReceiptsLayout;
