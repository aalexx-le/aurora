import {
    Bot,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    Wallet,
} from "lucide-react";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import SETTING_ROUTE from "@/lib/routes/setting.route";

export const SIDEBAR_DATA = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Finance",
            url: DASHBOARD_ROUTE.finance.value,
            icon: Wallet,
            isActive: true,
            items: [
                {
                    title: "Expense",
                    url: DASHBOARD_ROUTE.finance.expense.value,
                },
                {
                    title: "Investment",
                    url: DASHBOARD_ROUTE.finance.investment.value,
                },
                // {
                //     title: "Asset Price",
                //     url: DASHBOARD_ROUTE.finance.investment.value,
                // },
            ],
        },
        {
            title: "Agents",
            url: "#",
            icon: Bot,
            isActive: true,
            items: [
                {
                    title: "Chatbot",
                    url: DASHBOARD_ROUTE.agent.chatbot.value,
                },
            ],
        },
        // {
        //     title: "Documentation",
        //     url: "#",
        //     icon: BookOpen,
        //     items: [
        //         {
        //             title: "Introduction",
        //             url: "#",
        //         },
        //         {
        //             title: "Get Started",
        //             url: "#",
        //         },
        //         {
        //             title: "Tutorials",
        //             url: "#",
        //         },
        //         {
        //             title: "Changelog",
        //             url: "#",
        //         },
        //     ],
        // },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Appearance",
                    url: SETTING_ROUTE.appearance.value,
                },
                // {
                //     title: "Team",
                //     url: "#",
                // },
                // {
                //     title: "Billing",
                //     url: "#",
                // },
                // {
                //     title: "Limits",
                //     url: "#",
                // },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};
