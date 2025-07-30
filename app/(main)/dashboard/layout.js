import React from 'react'
import { Suspense } from 'react';
import Barloader from 'react-spinners/BarLoader';
import DashboardPage from './page';

function DashboardLayout() {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold gradient-title mb-5">Dashboard</h1>
      {/* Dashboard Page */}
      <Suspense fallback={<Barloader className='mt-4 width={"100%"} color={"#9333ea"}' />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
}

export default DashboardLayout