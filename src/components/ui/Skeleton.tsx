import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines }) => {
  if (lines) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
          />
        ))}
      </div>
    );
  }

  return <div className={`skeleton ${className}`} />;
};

export const PostSkeleton: React.FC = () => (
  <div className="bg-[#131629] border border-[#2a2f52] rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-3 w-20" />
      </div>
    </div>
    <div className="flex flex-col gap-2 mb-4">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-4 w-3/5" />
    </div>
    <div className="skeleton h-48 w-full rounded-xl" />
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="skeleton h-32 w-full rounded-xl mb-4" />
    <div className="skeleton w-20 h-20 rounded-full -mt-10 ml-4 mb-3" />
    <div className="flex flex-col gap-2 px-4">
      <div className="skeleton h-5 w-40" />
      <div className="skeleton h-4 w-28" />
      <div className="skeleton h-4 w-full" />
    </div>
  </div>
);
