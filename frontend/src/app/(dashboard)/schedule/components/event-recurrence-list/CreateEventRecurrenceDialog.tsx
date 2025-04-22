// import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
// import { RecurrenceType } from "@/gql/graphql";
// import { RecurrenceInput, recurrenceSchema } from "@/lib/schema/eventRecurrence";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { RecurrenceForm } from "./RecurrenceForm";
// import { useCreateEventRecurrenceMutation } from "./useCreateEventRecurrenceMutation";

// export const CreateEventRecurrenceDialog = () => {
//   const { handleCreateRecurrence, loading } = useCreateEventRecurrenceMutation();
  
//   const defaultValues = useMemo<RecurrenceInput>(() => ({
//     type: RecurrenceType.Daily,
//     interval: 1,
//   }), []);

//   const form = useForm<RecurrenceInput>({
//     resolver: zodResolver(recurrenceSchema),
//     defaultValues
//   });

//   const handleSubmit = async (data: RecurrenceInput) => {
//     await handleCreateRecurrence(data);
//   };

//   return (
//     <CreateOrUpdateDialog<RecurrenceInput>
//       title="Create Recurrence Template"
//       description="Create a new template for recurring events that you can reuse when creating events."
//       formSchema={recurrenceSchema}
//       defaultValues={defaultValues}
//       onSubmit={handleSubmit}
//       loading={loading}
//       form={form}
//     >
//       {(form) => (
//         <div className="space-y-4">
//           <div className="grid gap-4">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <h3 className="text-lg font-medium">Template Details</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Create a reusable recurrence pattern for events.
//                 </p>
//               </div>
              
//               <RecurrenceForm 
//                 form={form}
//                 setRecurrenceSummary={() => {}}
//                 // onSubmit={async (data) => {
//                 //   await form.handleSubmit(handleSubmit)(data as any);
//                 //   return true;
//                 // }} 
//                 // isSubmitting={loading} 
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </CreateOrUpdateDialog>
//   );
// }; 