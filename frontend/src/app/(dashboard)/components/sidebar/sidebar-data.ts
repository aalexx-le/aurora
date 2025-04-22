import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import SETTING_ROUTE from "@/lib/routes/setting.route";
import {
    Bot,
    Calendar,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    Wallet,
} from "lucide-react";

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
            ],
        },
        {
            title: "Schedule",
            url: DASHBOARD_ROUTE.schedule.value,
            icon: Calendar,
            isActive: false,
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
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Appearance",
                    url: SETTING_ROUTE.appearance.value,
                },
                {
                    title: "Subscription",
                    url: SETTING_ROUTE.subscription.value,
                },
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
