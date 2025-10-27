'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, TransactionFormData, CreateTransactionData } from '@/types';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: CreateTransactionData) => Promise<void>;
  initialData?: Partial<TransactionFormData>;
}

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'GCash',
  'PayMaya',
  'GrabPay',
  'Other'
];

export function TransactionForm({ categories, onSubmit, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    category_id: initialData?.category_id || '',
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    transaction_date: initialData?.transaction_date || new Date().toISOString().split('T')[0],
    transaction_type: initialData?.transaction_type || 'expense',
    payment_method: initialData?.payment_method || '',
    location: initialData?.location || '',
    tags: initialData?.tags || []
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.amount) {
      return;
    }

    const transactionData: CreateTransactionData = {
      category_id: formData.category_id,
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
      transaction_date: formData.transaction_date,
      transaction_type: formData.transaction_type,
      payment_method: formData.payment_method || undefined,
      location: formData.location || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined
    };

    try {
      await onSubmit(transactionData);
      // Reset form after successful submission
      setFormData({
        category_id: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        transaction_type: 'expense',
        payment_method: '',
        location: '',
        tags: []
      });
      setTagInput('');
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const incomeCategories = categories.filter(cat => cat.is_income);
  const expenseCategories = categories.filter(cat => !cat.is_income);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Transaction Details Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Transaction Details</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Basic information about your transaction</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="transaction_type" className="text-xs sm:text-sm font-medium text-foreground">Transaction Type *</Label>
            <Select
              value={formData.transaction_type}
              onValueChange={(value: 'income' | 'expense') =>
                setFormData(prev => ({ ...prev, transaction_type: value, category_id: '' }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-xs sm:text-sm font-medium text-foreground">Category *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {(formData.transaction_type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Financial Information</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Amount and timing details</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm font-medium text-foreground">Amount (₱) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
              className="text-sm sm:text-base"
            />
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label htmlFor="transaction_date" className="text-xs sm:text-sm font-medium text-foreground">Date *</Label>
            <Input
              id="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
              required
              className="text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Additional Details</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Optional information to help track your transaction</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment_method" className="text-xs sm:text-sm font-medium text-foreground">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, payment_method: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs sm:text-sm font-medium text-foreground">Location</Label>
            <Input
              id="location"
              placeholder="Where did this transaction happen?"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Description</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Add more context about this transaction</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-foreground">Description</Label>
          <Textarea
            id="description"
            placeholder="What was this transaction for?"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
          />
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Tags</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Add tags to categorize and filter your transactions</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-xs sm:text-sm font-medium text-foreground">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="text-sm sm:text-base"
            />
            <Button type="button" onClick={addTag} variant="outline" className="px-3 sm:px-4">
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive text-sm"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-border">
        <Button type="submit" className="w-full text-sm sm:text-base" size="lg">
          Add Transaction
        </Button>
      </div>
    </form>
  );
}