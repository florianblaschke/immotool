import { getPropertyById } from "@/server/property/property";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const data = await getPropertyById(params.id);

  if (!data?.body) {
    return notFound();
  }

  const { heatingSystem, capacity, commercial, units } = data.body;

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
        <p>Wohnungen: {units}</p>
        <p>Gewerblich: {commercial}</p>
        <p>Heizung: {heatingSystem}</p>
        {capacity && <p>Tankkapazität: {capacity}</p>}
      </div>
    </div>
  );
}
