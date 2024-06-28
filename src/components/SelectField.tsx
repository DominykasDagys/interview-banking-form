import { TextField } from "@mui/material";
import { PropsWithChildren } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface SelectFieldProps<T extends FieldValues> extends PropsWithChildren {
  label: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const SelectField = <T extends FieldValues>({
  control,
  label,
  name,
  error,
  placeholder,
  required,
  children,
}: SelectFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            label={required ? `${label} *` : label}
            fullWidth
            autoComplete="off"
            error={Boolean(error)}
            placeholder={placeholder}
            helperText={error}
            select
          >
            {children}
          </TextField>
        );
      }}
    />
  );
};

export default SelectField;
