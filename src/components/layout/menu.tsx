import type { ReactNode } from "react";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";

import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";

import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";
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
    icon: <EventAvailableIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN", "TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
    children: [
      {
        label: "My Leaves",
        path: "/leaves",
        icon: <EventAvailableIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
      },
      {
        label: "Apply Leave",
        path: "/leaves/apply",
        icon: <EventNoteIcon />,
        roles: ["TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
      },
      {
        label: "Leave Requests",
        path: "/leaves/all",
        icon: <AssignmentIcon />,
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
      {
        label: "Payroll Dashboard",
        path: "/payroll",
        icon: <ReceiptIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
      },
      {
        label: "Payroll Profiles",
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
    label: "Departments",
    path: "/departments",
    icon: <BusinessIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN"],
  },
  {
    label: "Positions",
    path: "/positions",
    icon: <WorkIcon />,
    roles: ["SUPERADMIN", "HR_ADMIN"],
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
