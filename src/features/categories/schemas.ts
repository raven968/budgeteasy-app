import type { TFunction } from 'i18next';
import { z } from 'zod';

import { CATEGORY_ICON_KEYS } from './catalog';

export function createCategorySchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.required')).max(50),
    icon: z.enum(CATEGORY_ICON_KEYS),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  });
}

export type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;
