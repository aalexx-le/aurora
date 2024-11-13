import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import React, {useState} from "react";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {GET_BRIEF_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {useAppSelector} from "@/state/hooks";
import CategoryAvatar from "@/app/dashboard/finance/bank-management/components/category-list/CategoryAvatar";

interface IProps {
    selectedCategoryId: string;
    setSelectedCategoryId: (categoryId: string) => void;
}

export default function CategorySelector({
                                             selectedCategoryId,
                                             setSelectedCategoryId,
                                         }: IProps) {
    const {user} = useAppSelector((state) => state.auth.state);
    const [open, setOpen] = useState(false);
    const {
        data,
    } = useQuery<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>(GET_BRIEF_EXPENSE_CATEGORIES, {
        variables: {userId: Number(user?.id)},
    });

    const categories = data?.getExpenseCategories ?? [];
    const selectedCategory = categories.find(
        (c) => c.id === selectedCategoryId,
    );
    const onSelect = (id: string) => {
        setSelectedCategoryId(id);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between gap-2"
                >
                    {selectedCategory ?
                        <div className="flex gap-2 items-center">
                            <CategoryAvatar avatar={selectedCategory.color} className="w-4 h-4"/>
                            <div className="flex gap-2 max-w-[18rem] overflow-hidden">
                                <p className="truncate">{selectedCategory.name}</p>
                            </div>
                        </div>
                        : "Select category"}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search category..."/>
                    <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((ctg) => (
                                <CommandItem
                                    key={ctg.id}
                                    value={ctg.id}
                                    onSelect={onSelect}
                                >
                                    <div className="flex items-center gap-4">
                                        <CategoryAvatar avatar={ctg.color} />
                                        <div className="max-w-[12rem]">
                                            <p className="overflow-hidden truncate text-sm font-medium leading-none">{ctg.name}</p>
                                            <p className="overflow-hidden truncate text-sm text-muted-foreground">
                                                {ctg.description}
                                            </p>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
