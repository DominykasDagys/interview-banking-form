import Head from "next/head";
import { Inter } from "next/font/google";
import TransactionForm from "../modules/TransactionForm";
import { Box, Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Interview task</title>
        <meta name="description" content="Interview task" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          maxWidth="600px"
          mx="auto"
          display="flex"
          flexDirection="column"
          px="32px"
        >
          <Typography variant="h1" fontSize="2rem" fontWeight="bold">
            Transaction Form
          </Typography>
          <TransactionForm />
        </Box>
      </main>
    </>
  );
}
