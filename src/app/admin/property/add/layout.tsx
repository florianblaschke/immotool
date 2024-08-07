import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SidebarNav";

const sidebarNavItems = [
  {
    title: "Grunddaten",
    href: "/admin/property/add",
    hidden: false,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="m-4 block rounded border p-6 pb-16 md:hidden">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Neue Liegenschaft
          </h2>
          <p className="text-muted-foreground">
            Lege hier eine neue Liegenschaft an
          </p>
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
            Neue Liegenschaft
          </h2>
          <p className="text-muted-foreground">
            Lege hier eine neue Liegenschaft an
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
