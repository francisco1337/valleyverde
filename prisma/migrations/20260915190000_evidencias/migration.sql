-- CreateTable
CREATE TABLE `evidencias` (
    `id` VARCHAR(191) NOT NULL,
    `eventoId` VARCHAR(191) NOT NULL,
    `imagen` LONGTEXT NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `evidencias_eventoId_idx`(`eventoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `evidencias`
    ADD CONSTRAINT `evidencias_eventoId_fkey`
    FOREIGN KEY (`eventoId`) REFERENCES `eventos`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
