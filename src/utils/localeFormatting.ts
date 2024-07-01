import { IntlLocales, Language } from "@/types/settings";

export const convertIntlStringToFloat = (value: string, language: Language) => {
  const formatter = new Intl.NumberFormat(IntlLocales[language], {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  const parts = formatter.formatToParts(12345.6);
  let groupSeparator = "";
  let decimalSeparator = "";

  for (const part of parts) {
    if (part.type === "group") {
      groupSeparator = part.value;
    } else if (part.type === "decimal") {
      decimalSeparator = part.value;
    }
  }

  const normalizedNumberString = value
    .split(groupSeparator)
    .join("")
    .split(decimalSeparator)
    .join(".");

  return parseFloat(normalizedNumberString);
};

export const getSeparator = (language: Language) => {
  const formatter = new Intl.NumberFormat(IntlLocales[language], {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  const parts = formatter.formatToParts(12345.6);

  const decimalSeparator = parts.find((part) => part.type === "decimal")?.value;
  return decimalSeparator ?? ".";
};
