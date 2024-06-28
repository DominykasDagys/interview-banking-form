import * as yup from "yup";
import { PAYER_ACCOUNTS } from "./constants";
import axios from "axios";

const validateRemainingBalance = (
  value: number,
  context: yup.TestContext<yup.AnyObject>
) => {
  const selectedAccount = PAYER_ACCOUNTS.find(
    (account) => account.iban === context.parent.payerAccount
  );
  return selectedAccount ? value <= selectedAccount.balance : true;
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
    .number()
    .transform((val, original) => (original === "" ? undefined : val))
    .typeError("Value must be a number")
    .required("Required")
    .min(0.01, "Minimum amount is 0.01")
    .test("max", "Insufficient account balance", validateRemainingBalance),
  payeeAccount: yup
    .string()
    .required("Required")
    .trim()
    .test("valid-iban", "Invalid IBAN", validateIBAN),
  purpose: yup.string().required("Required").trim().min(3).max(135),
  payerAccount: yup.string().required("Required"),
  payee: yup.string().required("Required").trim().max(70),
});
