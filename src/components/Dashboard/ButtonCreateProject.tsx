import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export default function ButtonCreateProject() {
  const { isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <>
      <Button size="md" className="bg-morado text-white" onPress={onOpen}>
        Crear nuevo proyecto
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear nuevo proyecto
              </ModalHeader>
              <Divider className="my-2" />
              <ModalBody>
                <Input
                  label="Nombre del proyecto"
                  placeholder="Escribe el nombre del proyecto"
                  isRequired
                />
                <Input
                  label="Descripción (Opcional)"
                  placeholder="Escribe una descripción del proyecto"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button className="bg-morado text-white" onPress={onClose}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
