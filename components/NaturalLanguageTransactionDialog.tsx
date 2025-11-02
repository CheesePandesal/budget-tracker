'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { Category, TransactionFormData } from '@/types';
import { createTransaction } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';

interface NaturalLanguageTransactionDialogProps {
  categories: Category[];
  trigger?: React.ReactNode;
}

export function NaturalLanguageTransactionDialog({ 
  categories,
  trigger 
}: NaturalLanguageTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<TransactionFormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParse = async () => {
    if (!input.trim()) {
      toast.error('Please enter a transaction description');
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch('/api/ai/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse');
      }

      const data = await response.json();
      
      // Convert parsed data to form data format
      const formData: Partial<TransactionFormData> = {
        category_id: data.category_id,
        amount: data.amount.toString(),
        description: data.description,
        transaction_date: data.transaction_date || new Date().toISOString().split('T')[0],
        transaction_type: data.transaction_type,
        payment_method: data.payment_method || '',
        location: data.location || '',
        tags: data.tags || []
      };
      
      setParsedData(formData);
      toast.success('✨ Transaction parsed successfully!');
    } catch (error) {
      console.error('Parse error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to parse transaction'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createTransaction(data);
      if (result.success) {
        toast.success('Transaction added successfully!', {
          description: `${data.transaction_type === 'income' ? '+' : '-'}${formatCurrency(data.amount)}`,
        });
        setOpen(false);
        setInput('');
        setParsedData(null);
      } else {
        toast.error('Failed to add transaction', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast.error('Failed to add transaction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    setInput('');
    setParsedData(null);
  };

  const defaultTrigger = (
    <Button variant="outline" size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
      <MessageSquarePlus className="w-4 h-4 sm:w-5 sm:h-5" />
      Quick Add with AI
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Add Transaction with Natural Language
          </DialogTitle>
        </DialogHeader>

        {!parsedData ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Describe your transaction naturally
              </label>
              <Textarea
                placeholder='Try: "Spent $45.50 on lunch at Olive Garden yesterday"&#10;Or: "Received $2000 salary on 10/30"&#10;Or: "Paid $150 electricity bill with credit card"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleParse();
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleParse}
                disabled={isParsing || !input.trim()}
                className="flex-1"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Parse with AI
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setInput('')}
                disabled={isParsing}
              >
                Clear
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-muted p-3 rounded-md">
              <p className="font-medium">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mention the amount and what you spent on</li>
                <li>Add date if it&apos;s not today (e.g., &quot;yesterday&quot;, &quot;last Monday&quot;)</li>
                <li>Specify payment method if needed</li>
                <li>Press Ctrl/Cmd + Enter to parse quickly</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                ✅ AI parsed your transaction:
              </p>
              <div className="text-sm space-y-1 text-green-800 dark:text-green-200">
                <p><strong>Amount:</strong> {formatCurrency(parseFloat(parsedData.amount || '0'))}</p>
                <p><strong>Description:</strong> {parsedData.description || 'N/A'}</p>
                <p><strong>Type:</strong> {parsedData.transaction_type}</p>
                {parsedData.transaction_date && <p><strong>Date:</strong> {parsedData.transaction_date}</p>}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Review and edit the details below, then submit:
            </p>

            <TransactionForm
              categories={categories}
              onSubmit={handleSubmit}
              initialData={parsedData}
              isSubmitting={isSubmitting}
            />

            <Button
              variant="outline"
              onClick={() => {
                setParsedData(null);
                setInput('');
              }}
              className="w-full"
            >
              Start Over
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

