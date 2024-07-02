import * as yup from "yup";
import { PAYER_ACCOUNTS } from "./constants";
import { convertIntlStringToFloat } from "./localeFormatting";
import { useSettingsStore } from "@/store/settings";
import axios from "axios";

const validateMinAmount = (value: string) => {
  const numericValue = convertIntlStringToFloat(
    value,
    useSettingsStore.getState().language
  );
  return numericValue >= 0.01;
};

const validateRemainingBalance = (
  value: string,
  context: yup.TestContext<yup.AnyObject>
) => {
  const numericValue = convertIntlStringToFloat(
    value,
    useSettingsStore.getState().language
  );
  const selectedAccount = PAYER_ACCOUNTS.find(
    (account) => account.iban === context.parent.payerAccount
  );
  return selectedAccount ? numericValue <= selectedAccount.balance : false;
};

const validateIBAN = async (value: string) => {
  try {
    const response = await axios.get(`/api/validate?iban=${value}`);
    return response.data.valid;
  } catch (error) {
    return false;
  }
};

export const transactionSchema = yup.object().shape({
  amount: yup
    .string()
    .required("Required")
    .test("min", "Minimum amount is 0.01", validateMinAmount)
    .test("max", "Insufficient account balance", validateRemainingBalance),
  payeeAccount: yup
    .string()
    .required("Required")
    .trim()
    .test("valid-iban", "Invalid IBAN", validateIBAN),
  purpose: yup.string().required("Required").trim().min(3, 'Transaction purpose must be at least 3 characters').max(135, 'Transaction purpose must be at most 135 characters'),
  payerAccount: yup.string().required("Required"),
  payee: yup.string().required("Required").trim().min(3, 'Payee must be at least 3 characters').max(70, 'Payee must be at most 7 characters'),
});
