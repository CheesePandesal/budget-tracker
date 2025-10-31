'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Category, TransactionFormData, CreateTransactionData } from '@/types';
import { Receipt, DollarSign, FileText, MapPin, Tag as TagIcon, Plus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: CreateTransactionData) => Promise<void>;
  initialData?: Partial<TransactionFormData>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
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

export function TransactionForm({ categories, onSubmit, initialData, isSubmitting = false, mode = 'create' }: TransactionFormProps) {
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
      // Reset form after successful submission (only for create mode)
      if (mode === 'create') {
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
      }
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
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Transaction Details Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Transaction Details</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Basic information about your transaction</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label htmlFor="transaction_type" className="text-sm font-medium text-foreground">
                Transaction Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value: 'income' | 'expense') =>
                  setFormData(prev => ({ ...prev, transaction_type: value, category_id: '' }))
                }
              >
                <SelectTrigger className="!h-11 w-full bg-background hover:bg-accent/50 transition-colors text-sm px-3 py-2">
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
              <Label htmlFor="category_id" className="text-sm font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger className="!h-11 w-full bg-background hover:bg-accent/50 transition-colors text-sm px-3 py-2">
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
        </CardContent>
      </Card>

      {/* Financial Information Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Financial Information</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Amount and timing details</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Amount (₱) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                className="h-11 w-full bg-background text-sm px-3 py-2"
              />
            </div>

            {/* Transaction Date */}
            <div className="space-y-2">
              <Label htmlFor="transaction_date" className="text-sm font-medium text-foreground">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                required
                className="h-11 w-full bg-background text-sm px-3 py-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Additional Details</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Optional information to help track your transaction</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment_method" className="text-sm font-medium text-foreground">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, payment_method: value }))
                }
              >
                <SelectTrigger className="!h-11 w-full bg-background hover:bg-accent/50 transition-colors text-sm px-3 py-2">
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
              <Label htmlFor="location" className="text-sm font-medium text-foreground">Location</Label>
              <Input
                id="location"
                placeholder="Where did this transaction happen?"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="h-11 w-full bg-background text-sm px-3 py-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Description</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Add more context about this transaction</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="What was this transaction for?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] w-full resize-none bg-background text-sm px-3 py-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Tags</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Add tags to categorize and filter your transactions</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-foreground">Tags</Label>
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
                className="h-11 flex-1 bg-background text-sm px-3"
              />
              <Button 
                type="button" 
                onClick={addTag} 
                variant="outline" 
                className="px-4 h-11 gap-2"
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5",
                      "bg-primary/10 hover:bg-primary/20 text-primary",
                      "text-sm font-medium rounded-lg",
                      "transition-colors duration-200",
                      "border border-primary/20"
                    )}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-destructive transition-colors rounded-sm p-0.5 hover:bg-destructive/10"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
          size="lg"
          disabled={isSubmitting || !formData.category_id || !formData.amount}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {mode === 'edit' ? 'Updating Transaction...' : 'Adding Transaction...'}
            </>
          ) : (
            mode === 'edit' ? 'Update Transaction' : 'Add Transaction'
          )}
        </Button>
      </div>
    </form>
  );
}