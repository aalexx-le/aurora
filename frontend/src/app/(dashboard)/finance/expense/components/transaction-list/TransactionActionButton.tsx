import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction} from "react";
import {DotsHorizontalIcon, PlusIcon} from "@radix-ui/react-icons";
import {DataTableRowActionState, DataTableRowActionType} from "@/types";
import {CreateExpenseSheet} from "@/app/(dashboard)/finance/expense/components/expense-table/CreateExpenseSheet";
import {BankTransaction} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";

export enum TransactionExtraRowActionType {
    CREATE_FROM_AI_SUGGESTION = "CREATE_FROM_AI_SUGGESTION",
}

export type TransactionRowActionUnionType = DataTableRowActionType | TransactionExtraRowActionType

export const TransactionRowActionType = {
    ...DataTableRowActionType,
    ...TransactionExtraRowActionType,
}

interface IProps<RData> {
    row: BankTransaction,
    setAction: Dispatch<SetStateAction<TransactionRowActionUnionType | null>>
}

export function TransactionActionButton<RData>({row, setAction}: IProps<RData>) {
    const [isUpdatePending, startUpdateTransition] = React.useTransition()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="aspect-square"
                >
                    <DotsHorizontalIcon aria-hidden="true"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-10">
                <CreateExpenseSheet initTransactionId={row.id} />
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(TransactionRowActionType.CREATE_FROM_AI_SUGGESTION)}
                >
                    <PlusIcon />
                    AI Suggest Expense
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(TransactionRowActionType.CREATE)}
                >
                    <PlusIcon />
                    Create Expense
                </DropdownMenuItem>
                {/*<DropdownMenuSeparator/>*/}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}