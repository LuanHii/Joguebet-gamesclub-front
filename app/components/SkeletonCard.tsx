export function SkeletonCard() {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 w-48 bg-slate-700 rounded-md mb-2"></div>
            <div className="h-5 w-24 bg-slate-700 rounded-md"></div>
          </div>
          <div className="h-16 w-16 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    );
  }