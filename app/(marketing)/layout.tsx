import React, { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full">
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
