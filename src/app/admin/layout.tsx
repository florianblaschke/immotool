import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <AdminHeader />
      <div className="flex h-full w-full flex-1 flex-col gap-4 md:gap-8">
        {children}
      </div>
    </div>
  );
}
