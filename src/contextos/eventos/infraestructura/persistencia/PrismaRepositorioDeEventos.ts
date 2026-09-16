import { clientePrisma } from "@/contextos/compartido/infraestructura/persistencia/ClientePrisma";
import type { Evento } from "../../dominio/Evento";
import type { RepositorioDeEventos } from "../../dominio/puertos/RepositorioDeEventos";

export class PrismaRepositorioDeEventos implements RepositorioDeEventos {
  async guardar(evento: Evento): Promise<void> {
    await clientePrisma().evento.create({
      data: {
        id: evento.id,
        asignacionId: evento.asignacionId,
        servicioId: evento.servicioId,
        ubicacionId: evento.ubicacionId,
        tecnicoId: evento.tecnicoId,
        precio: evento.precio,
        fechaProgramada: evento.fechaProgramada,
        hora: evento.hora,
        notas: evento.notas ?? undefined,
        estado: "PROGRAMADO",
      },
    });
  }
}
