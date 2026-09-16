-- CreateTable: ubicaciones
CREATE TABLE IF NOT EXISTS `ubicaciones` (
    `id` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(500) NOT NULL,
    `latitud` DECIMAL(9, 6) NULL,
    `longitud` DECIMAL(9, 6) NULL,
    `notasDeAcceso` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `ubicaciones_clienteId_activo_idx`(`clienteId`, `activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: servicios
CREATE TABLE IF NOT EXISTS `servicios` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `precioSugerido` DECIMAL(10, 2) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `servicios_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: asignaciones (tecnicoId NO está aquí)
CREATE TABLE IF NOT EXISTS `asignaciones` (
    `id` VARCHAR(191) NOT NULL,
    `ubicacionId` VARCHAR(191) NOT NULL,
    `servicioId` VARCHAR(191) NOT NULL,
    `periodicidad` ENUM('DIARIO', 'SEMANAL', 'QUINCENAL', 'MENSUAL') NOT NULL,
    `precioPorEvento` DECIMAL(10, 2) NOT NULL,
    `fechaInicio` DATE NOT NULL,
    `fechaFin` DATE NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `asignaciones_ubicacionId_activo_idx`(`ubicacionId`, `activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: eventos
CREATE TABLE IF NOT EXISTS `eventos` (
    `id` VARCHAR(191) NOT NULL,
    `asignacionId` VARCHAR(191) NOT NULL,
    `servicioId` VARCHAR(191) NOT NULL,
    `ubicacionId` VARCHAR(191) NOT NULL,
    `tecnicoId` VARCHAR(191) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `fechaProgramada` DATE NOT NULL,
    `horaProgramada` TIME(0) NULL,
    `estado` ENUM('PROGRAMADO', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
    `completadoEn` DATETIME(3) NULL,
    `completadoPor` VARCHAR(191) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `eventos_asignacionId_fechaProgramada_key`(`asignacionId`, `fechaProgramada`),
    INDEX `eventos_tecnicoId_fechaProgramada_idx`(`tecnicoId`, `fechaProgramada`),
    INDEX `eventos_estado_fechaProgramada_idx`(`estado`, `fechaProgramada`),
    INDEX `eventos_servicioId_estado_idx`(`servicioId`, `estado`),
    INDEX `eventos_ubicacionId_fechaProgramada_idx`(`ubicacionId`, `fechaProgramada`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey (IF NOT EXISTS via ignore duplicate)
ALTER TABLE `ubicaciones`
    ADD CONSTRAINT `ubicaciones_clienteId_fkey`
    FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `asignaciones`
    ADD CONSTRAINT `asignaciones_ubicacionId_fkey`
    FOREIGN KEY (`ubicacionId`) REFERENCES `ubicaciones`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `asignaciones`
    ADD CONSTRAINT `asignaciones_servicioId_fkey`
    FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `eventos`
    ADD CONSTRAINT `eventos_asignacionId_fkey`
    FOREIGN KEY (`asignacionId`) REFERENCES `asignaciones`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `eventos`
    ADD CONSTRAINT `eventos_servicioId_fkey`
    FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `eventos`
    ADD CONSTRAINT `eventos_ubicacionId_fkey`
    FOREIGN KEY (`ubicacionId`) REFERENCES `ubicaciones`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `eventos`
    ADD CONSTRAINT `eventos_tecnicoId_fkey`
    FOREIGN KEY (`tecnicoId`) REFERENCES `usuarios`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `eventos`
    ADD CONSTRAINT `eventos_completadoPor_fkey`
    FOREIGN KEY (`completadoPor`) REFERENCES `usuarios`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
