import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onUpdate: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onUpdate }: DateRangePickerProps) {
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 }
  ];

  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onUpdate({ from, to });
  };

  return (
    <div className="flex items-center space-x-4">
      {presets.map(preset => (
        <Button
          key={preset.days}
          variant="secondary"
          size="sm"
          onClick={() => handlePresetClick(preset.days)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {preset.label}
        </Button>
      ))}
    </div>
  );
}