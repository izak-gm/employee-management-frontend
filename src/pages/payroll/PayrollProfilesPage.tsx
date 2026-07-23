import DashboardLayout from "../../components/layout/DashboardLayout";
import PayrollProfilesTable from "./PayrollProfileTable";

export default function PayrollProfilesPage() {
  return (
    <DashboardLayout title="Payroll Profiles">
      <PayrollProfilesTable />
    </DashboardLayout>
  );
}
