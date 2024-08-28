"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  generalCosts: z.object({
    waste: z.number().min(0),
    water: z.number().min(0),
    basicFee: z.number().min(0),
    sewage: z.number().min(0),
  }),
  additionalCosts: z.array(
    z.object({
      name: z.string().min(1, "Kostenart ist erforderlich"),
      amount: z.number().min(0, "Betrag muss positiv sein"),
    }),
  ),
  tenants: z.array(
    z.object({
      name: z.string(),
      organicWaste: z.number().min(0),
      residualWaste: z.number().min(0),
      paperWaste: z.number().min(0),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function Component() {
  const [step, setStep] = useState(1);
  const [calculationResult, setCalculationResult] = useState<FormValues | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      generalCosts: { waste: 0, water: 0, basicFee: 0, sewage: 0 },
      additionalCosts: [],
      tenants: [
        { name: "Mieter 1", organicWaste: 0, residualWaste: 0, paperWaste: 0 },
        { name: "Mieter 2", organicWaste: 0, residualWaste: 0, paperWaste: 0 },
      ],
    },
  });

  const {
    fields: additionalCostsFields,
    append: appendAdditionalCost,
    remove: removeAdditionalCost,
  } = useFieldArray({
    control: form.control,
    name: "additionalCosts",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setCalculationResult(data);
    setStep(4);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Schritt 1: Abrechnungszeitraum und allgemeine Kosten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Startdatum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Wählen Sie ein Datum</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Enddatum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Wählen Sie ein Datum</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="generalCosts.waste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abfall</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalCosts.water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wasser</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalCosts.basicFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grundgebühr</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalCosts.sewage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abwasser</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(2)}>Weiter</Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Schritt 2: Zusätzliche Kosten</CardTitle>
            </CardHeader>
            <CardContent>
              {additionalCostsFields.map((field, index) => (
                <div key={field.id} className="mb-2 flex space-x-2">
                  <FormField
                    control={form.control}
                    name={`additionalCosts.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Kostenart" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`additionalCosts.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Betrag"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeAdditionalCost(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Kosten löschen</span>
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendAdditionalCost({ name: "", amount: 0 })}
              >
                Weitere Kosten hinzufügen
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStep(1)}>Zurück</Button>
              <Button onClick={() => setStep(3)}>Weiter</Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Schritt 3: Mieterübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Biotonne</TableHead>
                    <TableHead>Restmüll</TableHead>
                    <TableHead>Papiermüll</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.getValues().tenants.map((tenant, index) => (
                    <TableRow key={index}>
                      <TableCell>{tenant.name}</TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`tenants.${index}.organicWaste`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`tenants.${index}.residualWaste`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`tenants.${index}.paperWaste`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => setStep(2)}>Zurück</Button>
              <Button type="submit">Berechnung durchführen</Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && calculationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Übersicht der Nebenkostenabrechnung</CardTitle>
              <CardDescription>
                Abrechnungszeitraum:{" "}
                {format(calculationResult.startDate, "dd.MM.yyyy")} -{" "}
                {format(calculationResult.endDate, "dd.MM.yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-lg font-semibold">Allgemeine Kosten</h3>
              <ul>
                <li>Abfall: {calculationResult.generalCosts.waste} €</li>
                <li>Wasser: {calculationResult.generalCosts.water} €</li>
                <li>
                  Grundgebühr: {calculationResult.generalCosts.basicFee} €
                </li>
                <li>Abwasser: {calculationResult.generalCosts.sewage} €</li>
              </ul>

              <h3 className="mb-2 mt-4 text-lg font-semibold">
                Zusätzliche Kosten
              </h3>
              <ul>
                {calculationResult.additionalCosts.map((cost, index) => (
                  <li key={index}>
                    {cost.name}: {cost.amount} €
                  </li>
                ))}
              </ul>

              <h3 className="mb-2 mt-4 text-lg font-semibold">
                Mieterübersicht
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Biotonne</TableHead>
                    <TableHead>Restmüll</TableHead>
                    <TableHead>Papiermü ll</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculationResult.tenants.map((tenant, index) => (
                    <TableRow key={index}>
                      <TableCell>{tenant.name}</TableCell>
                      <TableCell>{tenant.organicWaste}</TableCell>
                      <TableCell>{tenant.residualWaste}</TableCell>
                      <TableCell>{tenant.paperWaste}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(1)}>
                Neue Abrechnung erstellen
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </Form>
  );
}
