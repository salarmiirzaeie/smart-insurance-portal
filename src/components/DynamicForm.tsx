import React, { useEffect, useState } from "react";
import type { DynamicFormField } from "../types/formTypes";

type Props = {
  fields: DynamicFormField[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
};

const DynamicForm: React.FC<Props> = ({ fields, values, onChange }) => {
  const [dynamicOptionsMap, setDynamicOptionsMap] = useState<Record<string, any[]>>({});
  const flattenFields = (fields: DynamicFormField[]): DynamicFormField[] => {
    return fields.flatMap((field) => {
      const innerFields = [
        ...(field.type === "group" && Array.isArray(field.fields) ? flattenFields(field.fields) : []),
        ...(Array.isArray(field.children) ? flattenFields(field.children) : []),
      ];
      return [field, ...innerFields];
    });
  };

  useEffect(() => {
    const allFields = flattenFields(fields);

    allFields.forEach((field) => {
      if (field.type === "select" && field.dynamicOptions) {
        const { dependsOn, endpoint, method } = field.dynamicOptions;
        const dependencyValue = values[dependsOn];

        if (dependencyValue) {
          const url = `${endpoint}?${dependsOn}=${encodeURIComponent(dependencyValue)}`;
          fetch(url, { method: method || "GET" })
            .then((res) => res.json())
            .then((data) => {
              const options = Array.isArray(data) ? data : data.options || [];
              setDynamicOptionsMap((prev) => ({
                ...prev,
                [field.id]: options,
              }));
            })
            .catch((err) => {
              console.error(`Error fetching dynamic options for ${field.id}`, err);
              setDynamicOptionsMap((prev) => ({
                ...prev,
                [field.id]: [],
              }));
            });
        } else {
          setDynamicOptionsMap((prev) => ({
            ...prev,
            [field.id]: [],
          }));
        }
      }
    });
  }, [JSON.stringify(values), JSON.stringify(fields)]);

  const renderField = (field: DynamicFormField): React.ReactNode => {
    const { id, label, type, options, children, conditional, required, fields: groupFields, dynamicOptions } = field;

    if (conditional) {
      const { fieldId, value } = conditional;
      if (values[fieldId] !== value) return null;
    }

    if (type === "group" && Array.isArray(groupFields)) {
      return (
        <fieldset
          key={id}
          className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        >
          <legend className="font-semibold text-lg mb-3">{label}</legend>
          {groupFields.map(renderField)}
        </fieldset>
      );
    }

    const dynamic = dynamicOptionsMap[id];
    const sourceOptions = dynamic ?? options ?? [];

    const normalizedOptions = Array.isArray(sourceOptions)
      ? sourceOptions.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt))
      : [];

    let inputElement: React.ReactNode;

    switch (type) {
      case "text":
      case "number":
      case "date":
        inputElement = (
          <input
            type={type}
            id={id}
            required={required}
            value={values[id] || ""}
            onChange={(e) => onChange(id, e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        );
        break;

      case "textarea":
        inputElement = (
          <textarea
            id={id}
            required={required}
            value={values[id] || ""}
            onChange={(e) => onChange(id, e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        );
        break;

      case "select":
        const isDisabled = dynamicOptions && (!values[dynamicOptions.dependsOn] || normalizedOptions.length === 0);
        inputElement = (
          <select
            id={id}
            required={required}
            disabled={isDisabled}
            value={values[id] || ""}
            onChange={(e) => onChange(id, e.target.value)}
            className={`w-full rounded border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="">{isDisabled ? "..." : "Select..."}</option>
            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
        break;

      case "checkbox":
        if (normalizedOptions.length > 0) {
          const selectedValues = values[id] || [];
          inputElement = (
            <div className="space-y-2">
              {normalizedOptions.map((opt) => (
                <label key={opt.value} className="inline-flex items-center space-x-2 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={selectedValues.includes(opt.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newValues = checked
                        ? [...selectedValues, opt.value]
                        : selectedValues.filter((v: string) => v !== opt.value);
                      onChange(id, newValues);
                    }}
                    className="form-checkbox text-indigo-600 dark:bg-gray-700"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          inputElement = (
            <label className="inline-flex items-center space-x-2 cursor-pointer dark:text-white">
              <input
                type="checkbox"
                id={id}
                checked={!!values[id]}
                onChange={(e) => onChange(id, e.target.checked)}
                className="form-checkbox text-indigo-600 dark:bg-gray-700"
              />
              <span>{label}</span>
            </label>
          );
        }
        break;

      case "radio":
        inputElement = (
          <div className="space-y-2">
            {normalizedOptions.map((opt) => (
              <label key={opt.value} className="inline-flex items-center space-x-2 cursor-pointer dark:text-white">
                <input
                  type="radio"
                  name={id}
                  value={opt.value}
                  checked={values[id] === opt.value}
                  onChange={(e) => onChange(id, e.target.value)}
                  className="form-radio text-indigo-600 dark:bg-gray-700"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
        break;

      default:
        inputElement = <p className="text-red-600 dark:text-red-400">Unsupported field type: {type}</p>;
    }

    return (
      <div key={id} className="mb-5">
        {type !== "checkbox" || normalizedOptions.length === 0 ? (
          <label htmlFor={id} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        ) : null}
        {inputElement}
        {children && children.length > 0 && (
          <div className="pl-4 border-l-2 border-dashed border-gray-300 mt-3 dark:border-gray-600">
            {children.map(renderField)}
          </div>
        )}
      </div>
    );
  };

  return (
    <form className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {fields.map(renderField)}
    </form>
  );
};

export default DynamicForm;
