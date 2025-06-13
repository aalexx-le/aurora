import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getGraphqlErrorMessage } from '@/lib/utils/graphql';
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { DefaultValues, FieldValues, Path, UseFormReturn, useForm } from "react-hook-form";
import { ZodType } from 'zod';

interface CreateDialogProps<TFormValues extends FieldValues> {
  title: string;
  description?: string | React.ReactNode;
  formSchema: ZodType<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  children: (form: UseFormReturn<TFormValues>) => React.ReactNode;
  onSubmit: (data: TFormValues) => Promise<void>;

  triggerButton?: React.ReactNode;
  form?: UseFormReturn<TFormValues>;
  loading?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isUpdate?: boolean;
  showTrigger?: boolean;
  actionButtons?: React.ReactNode[];
}

export function CreateOrUpdateDialog<TFormValues extends FieldValues>({
  title,
  description,
  formSchema,
  defaultValues,
  children,
  onSubmit,
  loading = false,
  isUpdate = false,
  showTrigger = true,
  triggerButton,
  form: externalForm,
  open,
  onOpenChange,
  actionButtons,
}: CreateDialogProps<TFormValues>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  const internalForm = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const form = externalForm || internalForm;

  const handleSubmit = async (data: TFormValues) => {
    try {
      await onSubmit(data);
      form.reset(defaultValues);
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setInternalOpen(false);
      }
    } catch (e) {
      let isFieldError = false;
      const error = getGraphqlErrorMessage(e);
      Object.keys(form.getValues()).forEach((key) => {
        if (error.includes(key)) {
          form.setError(key as Path<TFormValues>, {
            type: 'server',
            message: error,
          });

          isFieldError = true;
        }
      })

      if (!isFieldError) {
        toast({
          title: 'Error',
          description: error,
        });
      }
    }
  };

  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  return (
    <Dialog open={open !== undefined ? open : internalOpen} onOpenChange={(isOpen) => {
      if (onOpenChange) {
        onOpenChange(isOpen);
      } else {
        setInternalOpen(isOpen);
      }
    }}>
      {showTrigger && (
        <DialogTrigger asChild>
          {triggerButton || (
            <Button variant="ghost" size="icon">
              <PlusIcon className="size-4" />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent aria-describedby={description ? undefined : "dialog-description"} className="overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            typeof description === 'string' ? (
              <DialogDescription className="flex items-center">
                {description}
              </DialogDescription>
            ) : (
              description
            )
          ) : (
            <DialogDescription id="dialog-description" className="sr-only">
              {title} dialog
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            {children(form)}
            <DialogFooter>
              {actionButtons && actionButtons.map((button, index) => (
                <div key={index}>
                  {button}
                </div>
              ))}
              <Button type="submit" disabled={loading}>
                {isUpdate ? (loading ? 'Updating...' : 'Update') : (loading ? 'Creating...' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 