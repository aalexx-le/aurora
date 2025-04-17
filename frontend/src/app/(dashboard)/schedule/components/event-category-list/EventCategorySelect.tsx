import { GET_EVENT_CATEGORIES } from "@/api/script/schedule/event-category";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@apollo/client";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { CreateEventCategoryDialog } from "./CreateEventCategoryDialog";
import { EventCategoryBadge } from "./EventCategoryBadge";
import { GetEventCategoriesQuery, GetEventCategoriesQueryVariables } from "@/gql/graphql";

interface EventCategorySelectProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (categoryId: number) => void;
}

export function EventCategorySelect({
  selectedCategoryId,
  setSelectedCategoryId,
}: EventCategorySelectProps) {
  const [open, setOpen] = useState(false);
  const { data } = useQuery<GetEventCategoriesQuery, GetEventCategoriesQueryVariables>(GET_EVENT_CATEGORIES);
  
  const categories = data?.getEventCategories ?? [];
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleSelect = (id: string) => {
    setSelectedCategoryId(Number(id));
    setOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between gap-2"
          >
            {selectedCategory ? (
              <EventCategoryBadge category={selectedCategory} />
            ) : (
              "Select category"
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 popover-content-width-full">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty className="flex flex-col items-center gap-2 p-4">
                <span>No categories found</span>
                <CreateEventCategoryDialog />
              </CommandEmpty>
              <ScrollArea className="max-h-[64]">
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={String(category.id)}
                      onSelect={handleSelect}
                    >
                      <EventCategoryBadge category={category} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 