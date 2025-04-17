import { CREATE_EVENT_CATEGORY, GET_EVENT_CATEGORIES } from "@/api/script/schedule/event-category";
import { CreateOrUpdateDialog } from "@/components/create-or-update-dialog";
import { GradientPicker } from "@/components/ui/color-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateEventCategoryMutation, CreateEventCategoryMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EventCategoryBadge } from "./EventCategoryBadge";

const createEventCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

type CreateEventCategoryInput = z.infer<typeof createEventCategorySchema>;

export function CreateEventCategoryDialog() {
  const defaultValues: CreateEventCategoryInput = {
    name: "",
    color: "#76c7ef",
  };

  const form = useForm<CreateEventCategoryInput>({
    resolver: zodResolver(createEventCategorySchema),
    defaultValues,
  });

  const [createCategory, { loading }] = useMutation<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>(CREATE_EVENT_CATEGORY, {
    refetchQueries: [GET_EVENT_CATEGORIES],
  });

  const handleSubmit = async (data: CreateEventCategoryInput) => {
    try {
      await createCategory({ variables: { data } });
      form.reset(defaultValues);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  return (
    <CreateOrUpdateDialog<CreateEventCategoryInput>
      title="Create Event Category"
      description="Add a new category to organize your events"
      formSchema={createEventCategorySchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      loading={loading}
    >
      {(form) => (
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
                name: form.watch("name") || "New Category",
                color: form.watch("color"),
              }}
            />
          </div>
        </>
      )}
    </CreateOrUpdateDialog>
  );
} 