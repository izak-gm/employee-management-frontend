import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters.")
    .optional()
    .or(z.literal("")),
});

export type OrganizationFormValues = z.infer<typeof schema>;

interface OrganizationDialogProps {
  open: boolean;
  title: string;
  loading?: boolean;

  initialValues?: OrganizationFormValues;

  onClose: () => void;

  onSubmit: (values: OrganizationFormValues) => Promise<void> | void;
}

export default function OrganizationDialog({
  open,
  title,
  loading = false,
  initialValues,
  onClose,
  onSubmit,
}: OrganizationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
      });
    }
  }, [open, initialValues, reset]);

  const submit = async (values: OrganizationFormValues) => {
    await onSubmit({
      ...values,
      description: values.description || undefined,
    });

    reset();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            autoFocus
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <LoadingButton loading={loading} variant="contained" onClick={handleSubmit(submit)}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
