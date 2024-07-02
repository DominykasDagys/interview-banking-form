import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PAYER_ACCOUNTS } from "@/utils/constants";
import axios from "axios";
import MainPage from "@/pages";

jest.mock("axios");

describe("TransactionForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all fields", () => {
    render(<MainPage />);

    expect(screen.getByTestId("input-amount")).toBeInTheDocument();
    expect(screen.getByTestId("input-payeeAccount")).toBeInTheDocument();
    expect(screen.getByTestId("input-purpose")).toBeInTheDocument();
    expect(screen.getByTestId("input-payerAccount")).toBeInTheDocument();
    expect(screen.getByTestId("input-payee")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<MainPage />);

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      const errorMessages = screen.getAllByText("Required");
      expect(errorMessages.length).toBe(4);
    });
  });

  it("validates minimum amount", async () => {
    render(<MainPage />);

    fireEvent.change(screen.getByTestId("input-amount"), {
      target: { value: "0" },
    });
    fireEvent.blur(screen.getByTestId("input-amount"));

    await waitFor(() => {
      expect(screen.getByText("Minimum amount is 0.01")).toBeInTheDocument();
    });
  });

  it("validates insufficient account balance", async () => {
    render(<MainPage />);

    fireEvent.change(screen.getByTestId("input-amount"), {
      target: { value: "1000000" },
    });
    fireEvent.change(screen.getByTestId("input-payerAccount"), {
      target: { value: PAYER_ACCOUNTS[0].iban },
    });
    fireEvent.blur(screen.getByTestId("input-amount"));

    await waitFor(() => {
      expect(
        screen.getByText("Insufficient account balance")
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { valid: true } });

    render(<MainPage />);

    fireEvent.change(screen.getByTestId("input-amount"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByTestId("input-payeeAccount"), {
      target: { value: PAYER_ACCOUNTS[1].iban },
    });
    fireEvent.change(screen.getByTestId("input-purpose"), {
      target: { value: "Test purpose" },
    });
    fireEvent.change(screen.getByTestId("input-payerAccount"), {
      target: { value: PAYER_ACCOUNTS[0].iban },
    });
    fireEvent.change(screen.getByTestId("input-payee"), {
      target: { value: "John Doe" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Transaction successful")).toBeInTheDocument();
    });
  });

  it("handles submission errors", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("Transaction failed")
    );
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { valid: true } });

    render(<MainPage />);

    fireEvent.change(screen.getByTestId("input-amount"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByTestId("input-payeeAccount"), {
      target: { value: PAYER_ACCOUNTS[1].iban },
    });
    fireEvent.change(screen.getByTestId("input-purpose"), {
      target: { value: "Test purpose" },
    });
    fireEvent.change(screen.getByTestId("input-payerAccount"), {
      target: { value: PAYER_ACCOUNTS[0].iban },
    });
    fireEvent.change(screen.getByTestId("input-payee"), {
      target: { value: "John Doe" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Transaction failed")).toBeInTheDocument();
    });
  });
});
