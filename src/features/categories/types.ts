export type Category = {
  id: number;
  name: string;
  /** Key of CATEGORY_ICONS. */
  icon: string;
  /** `#RRGGBB` */
  color: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryPayload = {
  name: string;
  icon: string;
  color: string;
};

/** GET /categories response. */
export type CategoryList = {
  data: Category[];
  meta: { max: number };
};
