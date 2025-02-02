import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { TransactionDetails } from "../types/transaction";
import InputField from "../components/InputField";
import { Box, Button, CircularProgress, MenuItem } from "@mui/material";
import { transactionSchema } from "@/utils/schemas";
import SelectField from "@/components/SelectField";
import { PAYER_ACCOUNTS } from "@/utils/constants";
import axios from "axios";
import { useAlertStore } from "@/store/alerts";
import { useSettingsStore } from "@/store/settings";
import {
  convertIntlStringToFloat,
  getSeparator,
} from "@/utils/localeFormatting";
import { useEffect, useRef } from "react";
import { IntlLocales } from "@/types/settings";

const TransactionForm = () => {
  const { success, error } = useAlertStore();
  const { language } = useSettingsStore();
  const prevAmount = useRef("");
  const prevLanguage = useRef(language);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<TransactionDetails>({
    resolver: yupResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      amount: "",
      payeeAccount: "",
      purpose: "",
      payerAccount: PAYER_ACCOUNTS[0].iban,
      payee: "",
    },
  });

  const payerAccount = useWatch({ control, name: "payerAccount" });

  useEffect(() => {
    if (getValues("amount") === "") return;
    trigger("amount")
  }, [getValues, payerAccount, trigger])

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { value } = e.target;

    if (value === "") {
      prevAmount.current = "0";
      e.target.value = "0";
      return;
    }

    // Allow only digits, commas, dots and spaces
    if (!/^[0-9,\.\s]+$/.test(value)) {
      e.target.value = prevAmount.current;
      return;
    }

    const numberFormat = new Intl.NumberFormat(IntlLocales[language], {
      style: "decimal",
      maximumFractionDigits: 2,
    });

    const formattedValue = formatAmount(value, numberFormat);
    e.target.value = formattedValue;
    prevAmount.current = formattedValue;
  };

  const formatAmount = (value: string, formatter: Intl.NumberFormat) => {
    let suffix = ""; // Used to append decimal point or zeros following decimal point
    const decimalSeparator = getSeparator(language);

    // If the value ends with a decimal separator, replace it with the correct one
    if (value.endsWith(".") || value.endsWith(",")) {
      value = value.slice(0, -1) + decimalSeparator;
      suffix = decimalSeparator;
    }

    const decimalSeparatorCount = value.split(decimalSeparator).length - 1;
    if (decimalSeparatorCount > 1) {
      return prevAmount.current;
    }

    const decimalSeparatorIndex = value.lastIndexOf(decimalSeparator);
    // Allow only two decimal places
    if (decimalSeparatorIndex !== -1 && decimalSeparatorIndex < value.length - 3) {
      return prevAmount.current;
    }

    if (value.endsWith(`${decimalSeparator}0`)) suffix = `${decimalSeparator}0`;
    if (value.endsWith(`${decimalSeparator}00`))
      suffix = `${decimalSeparator}00`;

    const floatValue = convertIntlStringToFloat(value, language);
    if (isNaN(floatValue)) {
      return prevAmount.current;
    }

    return formatter.format(floatValue) + suffix;
  };

  const onSubmit = async (data: TransactionDetails) => {
    try {
      const amountValue = convertIntlStringToFloat(data.amount, language);
      if (isNaN(amountValue)) {
        error("Invalid amount");
        return;
      }
      await axios.post("/api/transaction", { ...data, amount: amountValue });
      success("Transaction successful");
    } catch (err) {
      console.error(err);
      error("Transaction failed");
    }
  };

  useEffect(() => {
    if (prevLanguage.current !== language) {
      prevLanguage.current = language;
      prevAmount.current = "0";
      setValue("amount", "0");
    }
  }, [language, setValue]);

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
          onChange={handleAmountChange}
        />
        <InputField
          control={control}
          name="payeeAccount"
          label="Payee account number"
          placeholder="Enter payee account number"
          error={errors.payeeAccount?.message}
          required
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
          {PAYER_ACCOUNTS.map(({ id, iban, balance }) => {
            const numberFormat = new Intl.NumberFormat(IntlLocales[language], {
              style: "decimal",
              maximumFractionDigits: 2,
            });
            const formattedBalance = formatAmount(
              balance.toString(),
              numberFormat
            );

            return (
              <MenuItem key={id} data-testid={`account-${iban}`} value={iban}>
                {iban} (Balance: {formattedBalance})
              </MenuItem>
            );
          })}
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
          data-testid="submit-button"
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
