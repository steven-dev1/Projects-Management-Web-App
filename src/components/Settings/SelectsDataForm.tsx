import { useAppSelector } from "@/store/hooks";
import { Select, SelectItem } from "@heroui/react";
import InputSkeleton from "../Skeletons/InputSkeleton";
import { TOP_TIMEZONES } from "@/lib/consts";

export default function SelectsDataForm() {
  const { preferences, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <InputSkeleton />;
  }

  return (
    <>
      <Select
        label="Idioma"
        labelPlacement="inside"
        name="language"
        defaultSelectedKeys={
          preferences?.language ? new Set([preferences.language]) : new Set()
        }
        isRequired
      >
        <SelectItem key="es">Español</SelectItem>
        <SelectItem key="en">English</SelectItem>
      </Select>
      <Select
        label="Zona horaria"
        labelPlacement="inside"
        name="timezone"
        isVirtualized
        defaultSelectedKeys={
          preferences?.timezone ? new Set([preferences.timezone]) : new Set()
        }
      >
        {TOP_TIMEZONES.map((tz) => {
          return <SelectItem key={tz}>{tz}</SelectItem>;
        })}
      </Select>
    </>
  );
}
