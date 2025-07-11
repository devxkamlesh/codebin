import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import type { Snippet } from '../../types/snippet';

interface ContributionGraphProps {
  snippets: Snippet[];
  monthsToShow?: number;
}

interface ContributionDay {
  date: Date;
  count: number;
  snippetIds: string[];
}

// Get activity level based on contribution count
const getActivityLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function ContributionGraph({ snippets, monthsToShow = 12 }: ContributionGraphProps) {
  const [contributionData, setContributionData] = useState<Map<string, ContributionDay>>(new Map());
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [monthLabels, setMonthLabels] = useState<{ month: string, index: number }[]>([]);

  // Process snippets data whenever it changes
  useEffect(() => {
    console.log('Processing snippets for contribution graph:', snippets.length);
    processSnippetsData();
  }, [snippets]);

  // Generate the weeks array whenever contributionData changes
  useEffect(() => {
    generateCalendarGrid();
  }, [contributionData]);

  // Process snippets to build contribution data
  const processSnippetsData = () => {
    const contributions = new Map<string, ContributionDay>();
    
    // Calculate date range (last N months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsToShow);
    startDate.setDate(1); // Start from the 1st of the month
    
    // Initialize all days in the range with zero counts
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = formatDate(currentDate);
      contributions.set(dateKey, {
        date: new Date(currentDate),
        count: 0,
        snippetIds: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Count contributions for each day
    snippets.forEach(snippet => {
      if (snippet.createdAt) {
        // Convert Firestore timestamp to Date
        const createdAt = snippet.createdAt instanceof Timestamp 
          ? snippet.createdAt.toDate() 
          : new Date(snippet.createdAt);
        
        // Only count if within our date range
        if (createdAt >= startDate && createdAt <= endDate) {
          const dateKey = formatDate(createdAt);
          const existingDay = contributions.get(dateKey);
          
          if (existingDay) {
            existingDay.count += 1;
            existingDay.snippetIds.push(snippet.id);
            contributions.set(dateKey, existingDay);
          } else {
            contributions.set(dateKey, {
              date: createdAt,
              count: 1,
              snippetIds: [snippet.id]
            });
          }
        }
      }
    });
    
    setContributionData(contributions);
  };

  // Generate the calendar grid with weeks
  const generateCalendarGrid = () => {
    if (contributionData.size === 0) {
      setWeeks([]);
      setMonthLabels([]);
      return;
    }
    
    // Sort dates
    const sortedDates = Array.from(contributionData.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (sortedDates.length === 0) {
      setWeeks([]);
      setMonthLabels([]);
      return;
    }
    
    // Find the first Sunday to start our grid
    const firstDate = new Date(sortedDates[0].date);
    const dayOfWeek = firstDate.getDay();
    firstDate.setDate(firstDate.getDate() - dayOfWeek);
    
    // Generate weeks
    const generatedWeeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    let currentDate = new Date(firstDate);
    let weekIndex = 0;
    
    // Track months for labels
    const months: { month: string, index: number }[] = [];
    let lastMonth = -1;
    
    // Generate up to the current date
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    while (currentDate <= today) {
      // Check if we need to add a month label
      const month = currentDate.getMonth();
      if (month !== lastMonth) {
        months.push({
          month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate),
          index: weekIndex
        });
        lastMonth = month;
      }
      
      const dateKey = formatDate(currentDate);
      const dayData = contributionData.get(dateKey) || {
        date: new Date(currentDate),
        count: 0,
        snippetIds: []
      };
      
      currentWeek.push(dayData);
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Start a new week if we've reached Sunday or the end
      if (currentDate.getDay() === 0 || currentDate > today) {
        // Pad the last week if needed
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: new Date(currentDate),
            count: 0,
            snippetIds: []
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        generatedWeeks.push([...currentWeek]);
        currentWeek = [];
        weekIndex++;
      }
    }
    
    setWeeks(generatedWeeks);
    setMonthLabels(months);
  };

  // Handle mouse events for tooltips
  const handleMouseEnter = (day: ContributionDay, event: React.MouseEvent) => {
    const date = day.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const content = day.count === 0
      ? `No contributions on ${date}`
      : `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${date}`;
    
    setTooltipContent(content);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  // If no data, show a message
  if (weeks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No contribution data available for the selected time period.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex mb-1 pl-10">
        {monthLabels.map((month, i) => (
          <div 
            key={`${month.month}-${i}`} 
            className="text-xs text-gray-500"
            style={{ 
              position: 'absolute',
              left: `${month.index * 16 + 40}px`,
              top: '0px'
            }}
          >
            {month.month}
          </div>
        ))}
      </div>
      
      {/* Day labels */}
      <div className="flex">
        <div className="w-10 pr-2">
          <div className="h-4"></div> {/* Empty space for alignment */}
          <div className="h-3 text-xs text-gray-500 text-right">Mon</div>
          <div className="h-3"></div> {/* Empty space */}
          <div className="h-3 text-xs text-gray-500 text-right">Wed</div>
          <div className="h-3"></div> {/* Empty space */}
          <div className="h-3 text-xs text-gray-500 text-right">Fri</div>
        </div>
        
        {/* Calendar grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col">
                {week.map((day, dayIndex) => {
                  const activityLevel = getActivityLevel(day.count);
                  let bgColor = 'bg-gray-100'; // No activity
                  
                  if (activityLevel === 1) bgColor = 'bg-green-100';
                  else if (activityLevel === 2) bgColor = 'bg-green-300';
                  else if (activityLevel === 3) bgColor = 'bg-green-500';
                  else if (activityLevel === 4) bgColor = 'bg-green-700';
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 m-0.5 rounded-sm ${bgColor} cursor-pointer transition-colors hover:ring-2 hover:ring-blue-400`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      title={`${day.date.toLocaleDateString()}: ${day.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-end items-center mt-2 text-xs text-gray-600">
        <span className="mr-1">Less</span>
        <div className="w-3 h-3 bg-gray-100 rounded-sm mx-0.5"></div>
        <div className="w-3 h-3 bg-green-100 rounded-sm mx-0.5"></div>
        <div className="w-3 h-3 bg-green-300 rounded-sm mx-0.5"></div>
        <div className="w-3 h-3 bg-green-500 rounded-sm mx-0.5"></div>
        <div className="w-3 h-3 bg-green-700 rounded-sm mx-0.5"></div>
        <span className="ml-1">More</span>
      </div>
      
      {/* Tooltip */}
      {tooltipContent && (
        <div 
          className="absolute bg-gray-900 text-white text-xs rounded py-1 px-2 z-10 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 30}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
} 