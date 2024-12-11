"use client";
import React, {useMemo, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import {Input} from "../ui/input";
import {ControllerRenderProps, FieldValues, Path, PathValue, UseFormReturn} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {parseCurrency} from "@/lib/utils/currency/parse-currency";
import {vnMoneyFormatter} from "@/lib/utils/currency/vn-money-formatter";

interface TextInputProps<T extends FieldValues> extends React.HTMLAttributes<HTMLInputElement> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    maxValue?: number;
}

export default function CurrencyInput<T extends FieldValues>({name, form, label, className, maxValue, ...props}: TextInputProps<T>) {
    const initialValue = form.getValues()[name]
        ? vnMoneyFormatter.format(form.getValues()[name])
        : "";
    const maxFormattedValue = useMemo(() => maxValue ? vnMoneyFormatter.format(maxValue) : "", [maxValue]);

    const [value, setValue] = useState<PathValue<T, Path<T>>>(initialValue as PathValue<T, Path<T>>);

    function handleChange(realChangeFn: ControllerRenderProps['onChange'], formattedValue: string) {
        const realValue = parseCurrency(formattedValue);
        realChangeFn(realValue);
    }

    function handleInputChange(next: string) {
        const digits = next.replace(/\D/g, "");
        setValue(vnMoneyFormatter.format(Number(digits)) as PathValue<T, Path<T>>);
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
                                    {...props}
                                    onChange={(ev) => {
                                        handleInputChange(ev.target.value);
                                        handleChange(_change, ev.target.value);
                                    }}
                                    className={cn("font-bold", className)}
                                    value={value}
                                />
                                {Boolean(maxValue) && (
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