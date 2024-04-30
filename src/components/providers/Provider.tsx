import QueryProvider from "./QueryProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
