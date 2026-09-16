-- Agrega campos de cobranza al evento
ALTER TABLE `eventos`
  ADD COLUMN `pagado`   BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN `pagadoEn` DATETIME(3) NULL;

-- Índice para la vista de cobranza (eventos completados, pendientes de pago)
ALTER TABLE `eventos`
  ADD INDEX `eventos_estado_pagado_idx` (`estado`, `pagado`);
