"use client";
import React, {useMemo, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import {Input} from "../ui/input";
import {ControllerRenderProps, FieldValues, Path, PathValue, UseFormReturn} from "react-hook-form";
import {useConvertCurrency} from "@/lib/hooks/use-convert-currency";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {parseCurrency} from "@/lib/utils/currency/parse-currency";

interface TextInputProps<T extends FieldValues> extends React.HTMLAttributes<HTMLInputElement> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    maxValue?: number;
}

// currency config
const moneyFormatter = Intl.NumberFormat("pt-BR", {
    currency: "VND",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

type OnFieldChangeType = ControllerRenderProps['onChange']

export default function CurrencyInput<T extends FieldValues>({name, form, label, className, maxValue, ...props}: TextInputProps<T>) {
    const initialValue = form.getValues()[name]
        ? moneyFormatter.format(form.getValues()[name])
        : "";
    const maxFormattedValue = useMemo(() => maxValue ? moneyFormatter.format(maxValue) : "", [maxValue]);

    useConvertCurrency(form.getValues()[name]);

    const [value, setValue] = useState<PathValue<T, Path<T>>>(initialValue as PathValue<T, Path<T>>);

    function handleChange(realChangeFn: OnFieldChangeType, formattedValue: string) {
        const realValue = parseCurrency(formattedValue);
        realChangeFn(realValue);
    }

    function handleInputChange(next: string) {
        const digits = next.replace(/\D/g, "");
        setValue(moneyFormatter.format(Number(digits)) as PathValue<T, Path<T>>);
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => {
                field.value = value;
                const _change = field.onChange;

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    {...field}
                                    onChange={(ev) => {
                                        handleInputChange(ev.target.value);
                                        handleChange(_change, ev.target.value);
                                    }}
                                    className={cn("font-bold", className)}
                                    value={value}
                                />
                                {maxValue && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setValue(maxFormattedValue as PathValue<T, Path<T>>);
                                            handleChange(_change, maxFormattedValue);
                                        }}
                                    >
                                        Max
                                    </Button>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                );
            }}
        />
    );
}