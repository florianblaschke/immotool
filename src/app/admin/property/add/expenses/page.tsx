import ExpensesForm from "./ExpensesForm";

export default function ExpensesPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
        <ExpensesForm />
      </div>
    </div>
  );
}
