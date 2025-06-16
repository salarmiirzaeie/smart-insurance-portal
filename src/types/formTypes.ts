export type DynamicFormType = {
  formId: string;
  title: string;
  fields: DynamicFormField[];
};

export type OptionType = {
  label: string;
  value: string;
};

export type ConditionalType = {
  fieldId: string;
  value: string;
};

export type DynamicOptionsType = {
  dependsOn: string; // ID فیلدی که این فیلد به آن وابسته است
  endpoint: string; // مسیر API
  method?: "GET" | "POST"; // پیش‌فرض: GET
};

export type DynamicFormField = {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select" | "radio" | "checkbox" | "group";
  required?: boolean;
  options?: OptionType[]; // فقط برای select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditional?: ConditionalType;
  dynamicOptions?: DynamicOptionsType; // ← این خط اضافه شده
  children?: DynamicFormField[]; // برای فیلدهای تودرتو
  fields?: DynamicFormField[]; // فقط برای type: "group"
};
