import type { ReactNode } from "react";

import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import PersonIcon from "@mui/icons-material/Person";

export interface MenuItem {
  label: string;
  icon: ReactNode;
  path?: string;
  activeMatch?: string;
  roles: string[];
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    roles: [
      "SUPERADMIN",
      "HR_ADMIN",
      "HR_OFFICER",
      "PAYROLL_MANAGER",
      "FINANCE_MANAGER",
      "TECH_LEAD",
      "SOFTWARE_ENGINEER",
      "INTERN",
    ],
  },

  {
    label: "Employee Management",
    icon: <PeopleIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN"],
    children: [
      {
        label: "View Employees",
        path: "/employees",
        icon: <PeopleIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN"],
      },
    ],
  },

  {
    label: "Leave Management",
    icon: <BeachAccessIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN", "TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
    children: [
      {
        label: "My Leaves",
        path: "/leaves",
        icon: <BeachAccessIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
      },
      {
        label: "Apply Leave",
        path: "/leaves/apply",
        icon: <CalendarMonthIcon />,
        roles: ["TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
      },
      {
        label: "Leave Requests",
        path: "/leaves/all",
        icon: <EventNoteIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN"],
      },
    ],
  },
  {
    label: "Payroll",
    icon: <PaymentsIcon />,
    roles: [
      "SUPERADMIN",
      "HR_ADMIN",
      "HR_OFFICER",
      "PAYROLL_MANAGER",
      "FINANCE_MANAGER",
      "TECH_LEAD",
      "SOFTWARE_ENGINEER",
      "INTERN",
    ],
    children: [
      // This is dashboard
      {
        label: "Payroll Dashboard",
        path: "/payroll",
        icon: <ReceiptLongIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
      },

      {
        label: "Payrolls",
        path: "/payroll/profiles",
        icon: <ReceiptLongIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
      },

      {
        label: "Payslips",
        path: "/payroll/payslips",
        icon: <AccountBalanceWalletIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
      },
      {
        label: "My Payroll",
        path: "/payroll/me",
        icon: <PaymentsIcon />,
        roles: [
          "SUPERADMIN",
          "HR_ADMIN",
          "HR_OFFICER",
          "PAYROLL_MANAGER",
          "FINANCE_MANAGER",
          "TECH_LEAD",
          "SOFTWARE_ENGINEER",
          "INTERN",
        ],
      },
    ],
  },


  {
    label: "Settings",
    icon: <BeachAccessIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN"],
    children: [
      {
        label: "Departments",
        path: "/departments",
        icon: <BeachAccessIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN"],
      },
      {
        label: "Position",
        path: "/positions",
        icon: <CalendarMonthIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN"],
      },
    ],
  },
  {
    label: "My Profile",
    path: "/profile",
    icon: <PersonIcon />,
    roles: [
      "SUPERADMIN",
      "HR_ADMIN",
      "HR_OFFICER",
      "PAYROLL_MANAGER",
      "FINANCE_MANAGER",
      "TECH_LEAD",
      "SOFTWARE_ENGINEER",
      "INTERN",
    ],
  },
];
