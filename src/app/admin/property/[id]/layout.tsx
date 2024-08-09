import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "../add/SidebarNav";
import { getPropertyById } from "@/server/property/property";
import { notFound } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: number };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Grunddaten",
      href: `/admin/property/${params.id}`,
    },
    {
      title: "Grundbesitzabgaben",
      href: `/admin/property/${params.id}/expenses`,
    },
    {
      title: "Wohnungen",
      href: `/admin/property/${params.id}/flats`,
    },
    {
      title: "Zähler",
      href: `/admin/property/${params.id}/counters`,
    },
  ];
  const data = await getPropertyById(params.id);

  if (!data?.body) {
    return notFound();
  }

  const { street, streetNumber, zipCode, city } = data?.body;
  const streetAndNumber = `${street} ${streetNumber}`;
  const cityAndZip = `${zipCode} ${city}`;
  return (
    <>
      <div className="m-4 block rounded border p-6 pb-16 md:hidden">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {streetAndNumber}
          </h2>
          <p className="text-muted-foreground">{cityAndZip}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="scrollbar-hide overflow-x-scroll">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
      <div className="m-8 hidden rounded border p-6 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {streetAndNumber}
          </h2>
          <p className="text-muted-foreground">{cityAndZip}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-5xl">{children}</div>
        </div>
      </div>
    </>
  );
}
