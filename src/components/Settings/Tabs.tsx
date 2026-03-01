'use client'
import {Tabs, Tab} from "@heroui/react";
import DataForm from "./DataForm";
import SecurityTab from "./SecurityTab";

export default function TabsComponent() {
  return (
    <div className='w-full items-center justify-start flex flex-col gap-4'>
        <Tabs defaultSelectedKey={"basic-info"} aria-label="Options" className="w-full justify-center">
            <Tab value="basic-info" title="Información básica" className="flex w-full justify-center">
                <DataForm />
            </Tab>
            <Tab value="security" title="Seguridad" className="flex w-full justify-center">
                <SecurityTab />
            </Tab>
        </Tabs>
    </div>
  )
}
