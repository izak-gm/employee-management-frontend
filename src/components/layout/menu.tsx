import type { ReactNode } from "react";

import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import BusinessIcon from "@mui/icons-material/Business";
// import BadgeIcon from "@mui/icons-material/Badge";

import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AssessmentIcon from "@mui/icons-material/Assessment";
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
      {
        label: "Add Employee",
        path: "/employees/create",
        icon: <PersonAddIcon />,
        roles: ["SUPERADMIN", "HR_ADMIN"],
      },
      // {
      //   label: "Departments",
      //   path: "/departments",
      //   icon: <BusinessIcon />,
      //   roles: ["SUPERADMIN", "HR_ADMIN"],
      // },
      // {
      //   label: "Positions",
      //   path: "/positions",
      //   icon: <BadgeIcon />,
      //   roles: ["SUPERADMIN", "HR_ADMIN"],
      // },
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
        roles: ["SUPERADMIN", "HR_ADMIN", "TECH_LEAD", "SOFTWARE_ENGINEER", "INTERN"],
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

  // {
  //   label: "Attendance",
  //   icon: <AccessTimeIcon />,
  //   roles: ["SUPERADMIN", "HR_ADMIN"],
  //   children: [
  //     {
  //       label: "Attendance",
  //       path: "/attendance",
  //       icon: <AccessTimeIcon />,
  //       roles: ["SUPERADMIN", "HR_ADMIN"],
  //     },
  //   ],
  // },

  // {
  //   label: "Reports",
  //   icon: <AssessmentIcon />,
  //   roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
  //   children: [
  //     {
  //       label: "Reports",
  //       path: "/reports",
  //       icon: <AssessmentIcon />,
  //       roles: ["SUPERADMIN", "HR_ADMIN", "PAYROLL_MANAGER", "FINANCE_MANAGER"],
  //     },
  //   ],
  // },

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
