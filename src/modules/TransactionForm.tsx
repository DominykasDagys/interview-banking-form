import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TransactionDetails } from "../types/transaction";
import InputField from "../components/InputField";
import { Box, Button, CircularProgress, MenuItem } from "@mui/material";
import { transactionSchema } from "@/utils/schemas";
import SelectField from "@/components/SelectField";
import { PAYER_ACCOUNTS } from "@/utils/constants";
import axios from "axios";
import { useAlertStore } from "@/store/alerts";

const TransactionForm = () => {
  const { success, error } = useAlertStore();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<TransactionDetails>({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      payeeAccount: "",
      purpose: "",
      payerAccount: "",
      payee: "",
    },
  });

  const validateIBAN = async (value: string) => {
    try {
      const response = await axios.get(`/api/validate?iban=${value}`);
      if (!response.data.valid) {
        setError("payeeAccount", { message: "Invalid IBAN" });
        return;
      }

      setError("payeeAccount", {});
    } catch (error) {
      setError("payeeAccount", { message: "Invalid IBAN" });
    }
  };

  const formatAmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const validValue = /^\d+(\.\d{0,2})?$/.test(value)
      ? value
      : value.slice(0, -1);
    e.target.value = validValue;
  };

  const onSubmit = async (data: TransactionDetails) => {
    try {
      await axios.post("/api/transaction", data);
      success("Transaction successful");
    } catch (err) {
      console.error(err);
      error("Transaction failed");
    }
  };

  return (
    <>
      <Box
        component="form"
        mt="2rem"
        display="flex"
        flexDirection="column"
        gap="1rem"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          control={control}
          name="amount"
          label="Amount"
          placeholder="Enter amount"
          error={errors.amount?.message}
          required
          type="number"
          onChange={formatAmount}
        />
        <InputField
          control={control}
          name="payeeAccount"
          label="Payee Account number"
          placeholder="Enter payee account number"
          error={errors.payeeAccount?.message}
          required
          onBlur={(e) => validateIBAN(e.target.value)}
        />
        <InputField
          control={control}
          name="purpose"
          label="Transaction purpose"
          placeholder="Enter transaction purpose"
          error={errors.purpose?.message}
          multiline
          required
        />
        <SelectField
          control={control}
          name="payerAccount"
          label="Payer account number"
          placeholder="Enter payer account number"
          error={errors.payerAccount?.message}
          required
        >
          {PAYER_ACCOUNTS.map(({ id, iban, balance }) => (
            <MenuItem key={id} value={iban}>
              {iban} (Balance: {balance.toLocaleString()})
            </MenuItem>
          ))}
        </SelectField>
        <InputField
          control={control}
          name="payee"
          label="Payee name"
          placeholder="Enter payee name"
          error={errors.payee?.message}
          required
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isSubmitting}
        >
          Submit
          {isSubmitting && (
            <CircularProgress
              style={{ marginLeft: "1rem" }}
              size={16}
              color="inherit"
            />
          )}
        </Button>
      </Box>
    </>
  );
};

export default TransactionForm;
