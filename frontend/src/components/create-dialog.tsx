import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { DefaultValues, FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { ZodType } from 'zod';

interface CreateDialogProps<TFormValues extends FieldValues> {
  // Required props
  title: string;
  description?: string | React.ReactNode;
  formSchema: ZodType<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  children: (form: UseFormReturn<TFormValues>) => React.ReactNode;
  onSubmit: (data: TFormValues) => Promise<void>;
  loading?: boolean;
  
  // Optional props
  triggerButton?: React.ReactNode;
  form?: UseFormReturn<TFormValues>;
}

export function CreateDialog<TFormValues extends FieldValues>({
  title,
  description,
  formSchema,
  defaultValues,
  children,
  onSubmit,
  loading = false,
  triggerButton,
  form: externalForm
}: CreateDialogProps<TFormValues>) {
  const [openDialog, setOpenDialog] = useState(false);
  
  const internalForm = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const form = externalForm || internalForm;

  const handleSubmit = async (data: TFormValues) => {
    try {
      await onSubmit(data);
      form.reset(defaultValues);
      setOpenDialog(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="ghost" size="icon">
            <PlusIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            typeof description === 'string' ? (
              <DialogDescription className="flex items-center">
                {description}
              </DialogDescription>
            ) : (
              description
            )
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            {children(form)}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 