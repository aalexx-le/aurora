"use client";

import { GET_EVENT_CATEGORIES, UPDATE_EVENT_CATEGORY } from "@/api/schedule/event-category";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { GradientPicker } from "@/components/ui/color-picker";
import { Dialog } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { EventCategoryBadge } from "./EventCategoryBadge";
import { EventCategory } from "./types";

const updateEventCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

type UpdateEventCategoryInput = z.infer<typeof updateEventCategorySchema>;

// Create a separate function for the category form fields
const getCategoryForm = (form: UseFormReturn<UpdateEventCategoryInput>) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Category name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="color"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <GradientPicker
                popupAlign="end"
                background={form.getValues("color")}
                setBackground={(color) => form.setValue('color', color)}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <div className="mt-4">
        <FormLabel>Preview</FormLabel>
        <EventCategoryBadge
          category={{
            name: form.watch("name") || "Category",
            color: form.watch("color"),
          }}
        />
      </div>
    </>
  );
};

interface IProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  category: EventCategory | null;
}

export function UpdateEventCategoryDialog({ category, ...props }: IProps) {
  const form = useForm<UpdateEventCategoryInput>({
    resolver: zodResolver(updateEventCategorySchema),
  });
  
  const [updateCategory, { loading }] = useMutation<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>(UPDATE_EVENT_CATEGORY, {
    refetchQueries: [GET_EVENT_CATEGORIES],
  });

  const defaultValues = useMemo(() => ({
    name: category?.name ?? '',
    color: category?.color ?? '',
  }), [category]);

  useEffect(() => {
    if (!category) return;
    form.reset(defaultValues);
  }, [category, form, defaultValues]);

  const onSubmit = async (data: UpdateEventCategoryInput) => {
    if (!category) return;

    await updateCategory({
      variables: {
        id: category.id,
        data
      },
    });
  };

  return (
    <CreateOrUpdateDialog<UpdateEventCategoryInput>
      title="Update Event Category"
      formSchema={updateEventCategorySchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      form={form}
      loading={loading}
      open={props.open}
      onOpenChange={props.onOpenChange}
      showTrigger={false}
      isUpdate
    >
      {getCategoryForm}
    </CreateOrUpdateDialog>
  );
}
