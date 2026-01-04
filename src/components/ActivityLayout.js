"use client";
import BackButton from "./BackButton";

/**
 * Standard layout wrapper for activity pages
 */
export default function ActivityLayout({ 
  title, 
  description, 
  icon = "🎮",
  children 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/activities" label="Back to Activities" />
        
        <div className="text-center mb-8 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {icon} {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
