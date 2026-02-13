import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full bg-transparent">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
};

export default PageLoader;
