import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-reading rounded-xl p-5 border border-border-reading flex flex-col sm:flex-row gap-5 animate-pulse">
    <div className="w-full sm:w-36 h-48 bg-border-subtle/60 rounded-md shrink-0" />
    <div className="flex-1 flex flex-col justify-between py-1">
      <div className="space-y-3">
        <div className="w-24 h-4 bg-border-subtle/60 rounded" />
        <div className="w-4/5 h-6 bg-border-subtle/80 rounded" />
        <div className="w-full h-12 bg-border-subtle/40 rounded" />
      </div>
      <div className="flex items-center gap-3 pt-4">
        <div className="w-24 h-9 bg-border-subtle/70 rounded-md" />
        <div className="w-24 h-9 bg-border-subtle/50 rounded-md" />
      </div>
    </div>
  </div>
);

export const WorkDetailSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-pulse">
    <div className="w-32 h-5 bg-border-subtle rounded" />
    <div className="w-3/4 h-10 bg-border-subtle/80 rounded" />
    <div className="w-1/3 h-5 bg-border-subtle/60 rounded" />
    <div className="w-full h-32 bg-reading border border-border-reading rounded-xl p-6" />
    <div className="w-full h-96 bg-border-subtle/30 rounded-xl" />
  </div>
);
