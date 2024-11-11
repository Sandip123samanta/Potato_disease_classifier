import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonLoder() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="flex items-center gap-5 border border-white/30 w-[20em] md:w-[30em] p-2 rounded-lg">
        <div>
          <Skeleton circle width={60} height={60} />
        </div>
        <div className="flex-1">
          <Skeleton count={2} style={{ marginBottom: '.6em' }} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default SkeletonLoder;
