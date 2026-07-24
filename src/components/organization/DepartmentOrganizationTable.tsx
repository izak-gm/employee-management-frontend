import { useMemo, useState } from "react";

import { Card, CardContent, InputAdornment, Stack, TextField, Typography } from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { DataGrid } from "@mui/x-data-grid";
import { departmentColumns, type OrganizationRow } from "../../tables/department/departmentColumns";

interface OrganizationTableProps<T extends OrganizationRow> {
  title: string;
  rows: T[];
  loading?: boolean;

  onEdit(row: T): void;
  onDelete(row: T): void;
}

export default function OrganizationTable<T extends OrganizationRow>({
  title,
  rows,
  loading = false,
  onEdit,
  onDelete,
}: OrganizationTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return rows;

    return rows.filter((row) =>
      [row.name ?? "", row.description ?? ""].some((field) => field.toLowerCase().includes(value)),
    );
  }, [rows, search]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>

            <TextField
              size="small"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <DataGrid
            rows={filteredRows}
            columns={departmentColumns(onEdit, onDelete)}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            sx={{
              minHeight: 550,
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.default",
                fontWeight: 700,
              },

              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
