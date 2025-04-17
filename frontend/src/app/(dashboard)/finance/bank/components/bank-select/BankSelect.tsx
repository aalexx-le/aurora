import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface IProps {
    selectedBank: string;
    setSelectedBank: (bank: BankInfo) => void;
    buttonClassName?: string;
}

export interface BankInfo {
    id: string;
    name: string;
    fullName: string;
    logo: string;
}

export const BANK_INFOS: BankInfo[] = [
    {
        id: "VCB",
        name: "Vietcombank",
        fullName: "Joint Stock Commercial Bank for Foreign Trade of Vietnam",
        logo: "https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-11.png"
    },
    {
        id: "CTG",
        name: "VietinBank",
        fullName: "Vietnam Joint Stock Commercial Bank for Industry and Trade",
        logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VietinBank-CTG-Ori.png"
    },
    {
        id: "BIDV",
        name: "BIDV",
        fullName: "Bank for Investment and Development of Vietnam",
        logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-BIDV-.png"
    },
    {
        id: "AGR",
        name: "Agribank",
        fullName: "Vietnam Bank for Agriculture and Rural Development",
        logo: "https://play-lh.googleusercontent.com/rNSXUqGnK-ljK6qUdUmy7h_sDrMOzZ1nPwAUAwshsmPaQuwNGn0Xwj-psgFrBSJOHg"
    },
    {
        id: "TCB",
        name: "Techcombank",
        fullName: "Vietnam Technological and Commercial Joint Stock Bank",
        logo: "https://s3-symbol-logo.tradingview.com/techcombank--600.png"
    },
    {
        id: "TPB",
        name: "TPBank",
        fullName: "Tien Phong Commercial Joint Stock Bank",
        logo: "https://dominhhai.com/wp-content/uploads/2021/10/unnamed-1.png"
    },
    {
        id: "MBB",
        name: "MB Bank",
        fullName: "Military Commercial Joint Stock Bank",
        logo: "https://icolor.vn/wp-content/uploads/2024/08/mbbank-logo-5.png"
    },
    {
        id: "VPB",
        name: "VPBank",
        fullName: "Vietnam Prosperity Joint-Stock Commercial Bank",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsYuDPp1ZlmeUwSBcdMZFmNFgcDplEDxJcig&s"
    },
    {
        id: "ACB",
        name: "ACB",
        fullName: "Asia Commercial Bank",
        logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB-Ori.png"
    },
    // {
    //     id: "STB",
    //     name: "Sacombank",
    //     fullName: "Saigon Thuong Tin Commercial Joint Stock Bank",
    //     logo: "https://upload.wikimedia.org/wikipedia/vi/a/a3/Logo_Sacombank.svg"
    // }
]

export function VietNamBankSelect({selectedBank, setSelectedBank, buttonClassName}: IProps) {
    const [open, setOpen] = React.useState(false);

    const onSelect = (bankId: string) => {
        const selected = BANK_INFOS.find(b => b.id === bankId);
        if (selected) {
            setSelectedBank(selected);
            setOpen(false);
        }
    }

    const selected = BANK_INFOS.find((bank) => bank.name === selectedBank);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={`justify-between w-full ${buttonClassName || ""}`}
                    aria-expanded={open}
                >
                    {selected ?
                        <div className="flex flex-row gap-2 items-center">
                            <Avatar className="h-4 w-4 rounded-lg">
                                <AvatarImage src={selected.logo} alt={selected.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {selected.name}
                                </AvatarFallback>
                            </Avatar>
                            {selected.name}
                        </div>
                        :
                        <p className="text-muted-foreground">Select bank...</p>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search banks..." />
                    <CommandList>
                        <CommandEmpty>No bank found.</CommandEmpty>
                        <CommandGroup>
                            {BANK_INFOS.map((bank) => (
                                <CommandItem
                                    key={bank.id}
                                    value={bank.id}
                                    onSelect={() => onSelect(bank.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-4 w-4 rounded-lg">
                                            <AvatarImage src={bank.logo} alt={bank.name}/>
                                            <AvatarFallback className="rounded-lg">
                                                {bank.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{bank.name}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}