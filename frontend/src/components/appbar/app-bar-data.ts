import { AppWindowIcon, CreditCard, HelpCircle, Home } from "lucide-react";
import { AppBarData } from "./app-bar";

export const APP_BAR_DATA: AppBarData = {
  navigation: [
    {
      id: "home",
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      id: "dashboard",
      title: "Dashboard",
      href: "/finance",
      icon: AppWindowIcon
    },
    {
      id: "plans",
      title: "Plans",
      href: "/plan",
      icon: CreditCard,
    },
    {
      id: "support",
      title: "Support",
      href: "/support",
      icon: HelpCircle,
      external: true,
    },
  ],
  showUserMenu: true,
  showMobileMenu: true,
};