import * as yup from "yup";
import { PAYER_ACCOUNTS } from "./constants";

const validateRemainingBalance = (
  value: number,
  context: yup.TestContext<yup.AnyObject>
) => {
  const selectedAccount = PAYER_ACCOUNTS.find(
    (account) => account.iban === context.parent.payerAccount
  );
  return selectedAccount ? value <= selectedAccount.balance : true;
};

export const transactionSchema = yup.object().shape({
  amount: yup
    .number()
    .transform((val, original) => (original === "" ? undefined : val))
    .typeError("Value must be a number")
    .required("Required")
    .min(0.01, "Minimum amount is 0.01")
    .test("max", "Insufficient account balance", validateRemainingBalance),
  payeeAccount: yup
    .string()
    .required("Required")
    .trim(),
  purpose: yup.string().required("Required").trim().min(3).max(135),
  payerAccount: yup.string().required("Required"),
  payee: yup.string().required("Required").trim().max(70),
});
