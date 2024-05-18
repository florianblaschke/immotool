import { tenantSchema } from "@/lib/validators";
import { createTenant } from "@/server/tenants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { queryClient } from "./providers/QueryProvider";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function TenantForm({
  closeMenu,
}: {
  closeMenu?: (x: boolean) => void;
}) {
  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      coldRent: 0,
      utilityRent: 0,
      email: "",
      mobile: "",
      phone: "",
    },
  });

  const refetchTenants = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tenants"] });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createTenant,
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error(res?.error);
      }
      toast.success("Das hat geklappt.");
      void refetchTenants();
      if (closeMenu) closeMenu(false);
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <div className="flex items-center gap-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="mobile"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobil</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormField
            name="coldRent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaltmiete</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="utilityRent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nebenkosten</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Mieter speichern
        </Button>
      </form>
    </Form>
  );
}
