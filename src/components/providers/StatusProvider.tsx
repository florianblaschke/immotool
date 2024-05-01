"use client";

import { ExpensesType, NewPropertyType } from "@/lib/validators";
import { createContext, useContext, useState } from "react";

type Values = {
  status: boolean;
  property?: NewPropertyType;
  expenses?: ExpensesType;
};

const StatusContext = createContext<Values>({ status: false });
export const useStatus = () => useContext(StatusContext);

export default function StatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState(false);
  const [values, setValues] = useState();
  return (
    <StatusContext.Provider value={{ status }}>
      {children}
    </StatusContext.Provider>
  );
}
