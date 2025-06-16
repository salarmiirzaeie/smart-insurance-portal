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
  dependsOn: string;
  endpoint: string;
  method?: "GET" | "POST";
};

export type DynamicFormField = {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select" | "radio" | "checkbox" | "group";
  required?: boolean;
  options?: OptionType[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditional?: ConditionalType;
  dynamicOptions?: DynamicOptionsType;
  children?: DynamicFormField[];
  fields?: DynamicFormField[];
};
