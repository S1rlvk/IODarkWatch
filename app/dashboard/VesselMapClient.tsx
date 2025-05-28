'use client';

import dynamic from 'next/dynamic';

const VesselMap = dynamic(() => import('../components/VesselMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-[#0a0a0a] text-white rounded-lg border border-[#333]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Loading map...</p>
      </div>
    </div>
  )
});

export default VesselMap; 