"use client";

import { useState } from "react";

interface DateRangePickerProps {
  onDateChange: (dateFrom?: Date, dateTo?: Date) => void;
  defaultToToday?: boolean;
}

type DateFilterOption = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

export default function DateRangePicker({ onDateChange, defaultToToday = true }: DateRangePickerProps) {
  const [selectedOption, setSelectedOption] = useState<DateFilterOption>(defaultToToday ? 'today' : 'last7days');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateRange = (option: DateFilterOption): { from?: Date; to?: Date } => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    // Set time to start of day for consistent filtering
    const startOfDay = (date: Date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const endOfDay = (date: Date) => {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
    };

    switch (option) {
      case 'today':
        return { from: startOfDay(today), to: endOfDay(today) };
      case 'yesterday':
        return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
      case 'last7days':
        return { from: startOfDay(last7Days), to: endOfDay(today) };
      case 'last30days':
        return { from: startOfDay(last30Days), to: endOfDay(today) };
      case 'custom':
        const from = customDateFrom ? startOfDay(new Date(customDateFrom)) : undefined;
        const to = customDateTo ? endOfDay(new Date(customDateTo)) : undefined;
        return { from, to };
      default:
        return {};
    }
  };

  const handleOptionChange = (option: DateFilterOption) => {
    setSelectedOption(option);
    const { from, to } = getDateRange(option);
    onDateChange(from, to);
  };

  const handleCustomDateChange = () => {
    if (selectedOption === 'custom') {
      const { from, to } = getDateRange('custom');
      onDateChange(from, to);
    }
  };

  // Initialize with default selection
  useState(() => {
    const { from, to } = getDateRange(selectedOption);
    onDateChange(from, to);
  });

  return (
    <div className="space-y-4">
      {/* Quick filter options */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last7days', label: 'Last 7 days' },
          { value: 'last30days', label: 'Last 30 days' },
          { value: 'custom', label: 'Custom range' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionChange(option.value as DateFilterOption)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background ${
              selectedOption === option.value
                ? 'bg-primary text-white'
                : 'bg-grey/20 text-foreground hover:bg-grey/30'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      {selectedOption === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-grey/10 rounded-lg">
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-foreground mb-2">
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              value={customDateFrom}
              onChange={(e) => {
                setCustomDateFrom(e.target.value);
                setTimeout(handleCustomDateChange, 0); // Delay to ensure state is updated
              }}
              className="block w-full px-3 py-2 border border-grey/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-foreground mb-2">
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              value={customDateTo}
              onChange={(e) => {
                setCustomDateTo(e.target.value);
                setTimeout(handleCustomDateChange, 0); // Delay to ensure state is updated
              }}
              className="block w-full px-3 py-2 border border-grey/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}