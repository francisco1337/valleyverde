import { ContrasenaHasheada } from "@/contextos/identidad/dominio/ContrasenaHasheada";
import { CredencialesInvalidas } from "@/contextos/identidad/dominio/errores/CredencialesInvalidas";
import { IdUsuario } from "@/contextos/identidad/dominio/IdUsuario";
import { NombreUsuario } from "@/contextos/identidad/dominio/NombreUsuario";
import type { CifradorDeContrasenas } from "@/contextos/identidad/dominio/puertos/CifradorDeContrasenas";
import type { Rol } from "@/contextos/identidad/dominio/Rol";
import type { SesionDeUsuario } from "@/contextos/identidad/dominio/SesionDeUsuario";

type PropiedadesUsuario = {
  id: IdUsuario;
  nombreUsuario: NombreUsuario;
  nombre: string;
  contrasena: ContrasenaHasheada;
  rol: Rol;
  activo: boolean;
};

/**
 * El agregado del contexto de identidad.
 *
 * Quién es alguien, qué rol tiene y si puede entrar. Nada más: propiedades,
 * clientes y rutas pertenecen a otros contextos y no cuelgan de aquí.
 */
export class Usuario {
  private constructor(private readonly props: PropiedadesUsuario) {}

  /** Alta de una cuenta nueva. La contraseña llega ya hasheada. */
  static registrar(props: {
    id: string;
    nombreUsuario: string;
    nombre: string;
    contrasena: ContrasenaHasheada;
    rol: Rol;
  }): Usuario {
    return new Usuario({
      id: IdUsuario.de(props.id),
      nombreUsuario: NombreUsuario.de(props.nombreUsuario),
      nombre: props.nombre.trim(),
      contrasena: props.contrasena,
      rol: props.rol,
      activo: true,
    });
  }

  /** Reconstruye el agregado desde almacenamiento. Sólo lo usa el repositorio. */
  static rehidratar(props: {
    id: string;
    nombreUsuario: string;
    nombre: string;
    hashDeContrasena: string;
    rol: Rol;
    activo: boolean;
  }): Usuario {
    return new Usuario({
      id: IdUsuario.de(props.id),
      nombreUsuario: NombreUsuario.de(props.nombreUsuario),
      nombre: props.nombre,
      contrasena: ContrasenaHasheada.de(props.hashDeContrasena),
      rol: props.rol,
      activo: props.activo,
    });
  }

  get id(): IdUsuario {
    return this.props.id;
  }

  get nombreUsuario(): NombreUsuario {
    return this.props.nombreUsuario;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get rol(): Rol {
    return this.props.rol;
  }

  get activo(): boolean {
    return this.props.activo;
  }

  /** El hash, para que el repositorio pueda persistirlo. */
  get contrasena(): ContrasenaHasheada {
    return this.props.contrasena;
  }

  /**
   * La regla completa de "esta persona puede entrar": la cuenta tiene que estar
   * activa **y** la contraseña tiene que coincidir. Las dos condiciones viven
   * juntas aquí para que ningún caso de uso pueda comprobar una y olvidar la
   * otra.
   *
   * Falle por lo que falle, el error es el mismo.
   */
  async autenticar(enClaro: string, cifrador: CifradorDeContrasenas): Promise<void> {
    if (!this.props.activo) {
      await cifrador.simularComparacion(enClaro);
      throw new CredencialesInvalidas();
    }

    if (!(await cifrador.coincide(enClaro, this.props.contrasena))) {
      throw new CredencialesInvalidas();
    }
  }

  /** Lo que se recuerda de esta persona mientras su sesión siga abierta. */
  aSesion(): SesionDeUsuario {
    return {
      idUsuario: this.props.id.valor,
      nombreUsuario: this.props.nombreUsuario.valor,
      nombre: this.props.nombre,
      rol: this.props.rol,
    };
  }
}
