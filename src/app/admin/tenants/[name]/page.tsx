import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { firstLetterToUpperCase } from "@/lib/utils";
import { getTenantById } from "@/server/tenants";
import { notFound } from "next/navigation";

export default async function TenantProfilePage({
  searchParams,
}: {
  searchParams: { id: number };
}) {
  const tenantData = await getTenantById({ id: searchParams.id });

  if (!tenantData?.body) return notFound();

  const tenant = tenantData.body;

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="w-full">
          <CardHeader className="bg-muted/20 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg" alt="Tenant Avatar" />
                <AvatarFallback>
                  {firstLetterToUpperCase(tenant.firstName, tenant.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-2xl font-bold">{`${tenant.firstName} ${tenant.lastName}`}</h2>
                {/* <p className="text-muted-foreground">Tenant</p> */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8 p-6">
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Kontaktdaten</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <div className="text-muted-foreground">Email</div>
                  <div>{tenant.email}</div>
                </div>
                <div className="grid gap-1">
                  <div className="text-muted-foreground">Phone</div>
                  <div>{tenant.phone}</div>
                </div>
                <div className="grid gap-1">
                  <div className="text-muted-foreground">Mobile</div>
                  <div>{tenant.mobile}</div>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Verträge</h3>
              <div className="grid gap-4">
                {tenant.rentContract.map((contract) => (
                  <Card key={contract.id}>
                    <CardContent className="grid gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground">
                          Vertrags-ID {contract.id}
                        </div>
                        <div className="text-sm font-medium">
                          {contract.movedOut ? "Inaktiv" : "Aktiv"}
                        </div>
                      </div>
                      <Separator />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-1">
                          <div className="text-muted-foreground">Einzug</div>
                          <div>{contract.movedIn}</div>
                        </div>
                        {contract.movedOut && (
                          <div className="grid gap-1">
                            <div className="text-muted-foreground">Auszug</div>
                            <div>{contract.movedOut}</div>
                          </div>
                        )}
                        <div className="grid gap-1">
                          <div className="text-muted-foreground">Kaltmiete</div>
                          <div>{contract.coldRent}</div>
                        </div>
                        <div className="grid gap-1">
                          <div className="text-muted-foreground">
                            Nebenkosten
                          </div>
                          <div>{contract.utilityRent}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
