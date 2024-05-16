"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

type Values = {
  status: boolean;
  setStatus: Dispatch<SetStateAction<boolean>>;
  propertyId: number;
  setPropertyId: Dispatch<SetStateAction<number>>;
};

const StatusContext = createContext<Values | null>(null);
export default function StatusProvider({
  children,
  values,
}: {
  children: React.ReactNode;
  values: Values;
}) {
  return (
    <StatusContext.Provider value={values}>{children}</StatusContext.Provider>
  );
}

export const useStatus = () => useContext(StatusContext);
