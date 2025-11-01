'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateSavingsGoalData } from '@/types';
import { Target, DollarSign, FileText, Calendar, Star, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface SavingsGoalFormData {
  name: string;
  description: string;
  target_amount: string;
  current_amount: string;
  target_date: string;
  priority: string;
}

interface SavingsGoalFormProps {
  onSubmit: (data: CreateSavingsGoalData) => Promise<void>;
  initialData?: Partial<SavingsGoalFormData>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const priorityOptions = [
  { value: '1', label: 'High Priority' },
  { value: '2', label: 'Medium Priority' },
  { value: '3', label: 'Low Priority' },
];

export function SavingsGoalForm({ onSubmit, initialData, isSubmitting = false, mode = 'create' }: SavingsGoalFormProps) {
  const [formData, setFormData] = useState<SavingsGoalFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    target_amount: initialData?.target_amount || '',
    current_amount: initialData?.current_amount || '0',
    target_date: initialData?.target_date || '',
    priority: initialData?.priority || '2',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.target_amount) {
      return;
    }

    const goalData: CreateSavingsGoalData = {
      name: formData.name,
      description: formData.description || undefined,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      target_date: formData.target_date || undefined,
      priority: parseInt(formData.priority),
      is_achieved: parseFloat(formData.current_amount) >= parseFloat(formData.target_amount),
    };

    try {
      await onSubmit(goalData);
      // Reset form after successful submission (only for create mode)
      if (mode === 'create') {
        setFormData({
          name: '',
          description: '',
          target_amount: '',
          current_amount: '0',
          target_date: '',
          priority: '2',
        });
      }
    } catch (error) {
      console.error('Failed to submit savings goal:', error);
    }
  };

  const progress = formData.target_amount && parseFloat(formData.target_amount) > 0
    ? Math.min(100, (parseFloat(formData.current_amount) / parseFloat(formData.target_amount)) * 100)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Goal Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Goal Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Emergency Fund, Vacation, New Car"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="text-sm sm:text-base"
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add any notes about this savings goal..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="text-sm sm:text-base resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Target Amount */}
      <div className="space-y-2">
        <Label htmlFor="target_amount" className="text-sm font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Target Amount <span className="text-destructive">*</span>
        </Label>
        <Input
          id="target_amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.target_amount}
          onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
          required
          className="text-sm sm:text-base"
          disabled={isSubmitting}
        />
        {formData.target_amount && !isNaN(parseFloat(formData.target_amount)) && (
          <p className="text-xs text-muted-foreground">
            Target: {formatCurrency(parseFloat(formData.target_amount))}
          </p>
        )}
      </div>

      {/* Current Amount - Only in edit mode for corrections */}
      {mode === 'edit' && (
        <div className="space-y-2">
          <Label htmlFor="current_amount" className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Current Amount
            <span className="text-xs font-normal text-muted-foreground ml-1">(for corrections)</span>
          </Label>
          <Input
            id="current_amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.current_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, current_amount: e.target.value }))}
            className="text-sm sm:text-base"
            disabled={isSubmitting}
          />
          {formData.target_amount && formData.current_amount && !isNaN(parseFloat(formData.target_amount)) && !isNaN(parseFloat(formData.current_amount)) && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress: {formatCurrency(parseFloat(formData.current_amount))}</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    progress >= 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-primary' : 'bg-primary/60'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Target Date */}
      <div className="space-y-2">
        <Label htmlFor="target_date" className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Target Date (Optional)
        </Label>
        <Input
          id="target_date"
          type="date"
          value={formData.target_date}
          onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
          className="text-sm sm:text-base"
          disabled={isSubmitting}
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Priority
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
          disabled={isSubmitting}
        >
          <SelectTrigger className="text-sm sm:text-base">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          type="submit"
          className="w-full sm:w-auto sm:ml-auto text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          disabled={isSubmitting || !formData.name || !formData.target_amount}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              {mode === 'create' ? 'Create Goal' : 'Update Goal'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
