-- CreateTable
CREATE TABLE `visitas` (
    `id` VARCHAR(191) NOT NULL,
    `ruta` VARCHAR(255) NOT NULL,
    `fecha` DATE NOT NULL,
    `hora` VARCHAR(5) NOT NULL,
    `rol` ENUM('ADMINISTRADOR', 'OFICINA', 'TECNICO') NULL,
    `usuarioId` VARCHAR(191) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `visitas_ruta_idx`(`ruta`),
    INDEX `visitas_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
