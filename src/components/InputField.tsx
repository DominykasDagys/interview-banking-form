import { TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  error?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputField = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  required,
  multiline,
  error,
  onChange,
}: InputFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            inputProps={{ "data-testid": `input-${name}` }}
            label={required ? `${label} *` : label}
            fullWidth
            autoComplete="off"
            error={Boolean(error)}
            placeholder={placeholder}
            helperText={error}
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
            onChange={(e) => {
              onChange?.(e);
              field.onChange(e);
            }}
          />
        );
      }}
    />
  );
};

export default InputField;
