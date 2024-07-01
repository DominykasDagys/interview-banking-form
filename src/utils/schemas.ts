import * as yup from "yup";
import { PAYER_ACCOUNTS } from "./constants";
import { convertIntlStringToFloat } from "./localeFormatting";
import { useSettingsStore } from "@/store/settings";

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

export const transactionSchema = yup.object().shape({
  amount: yup
    .string()
    .required("Required")
    .test("min", "Minimum amount is 0.01", validateMinAmount)
    .test("max", "Insufficient account balance", validateRemainingBalance),
  payeeAccount: yup.string().required("Required").trim(),
  purpose: yup.string().required("Required").trim().min(3).max(135),
  payerAccount: yup.string().required("Required"),
  payee: yup.string().required("Required").trim().max(70),
});
