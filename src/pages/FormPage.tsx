import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import DynamicForm from "../components/DynamicForm";
import type { DynamicFormType } from "../types/formTypes";
import { useTranslation } from "react-i18next";

const FormPage = () => {
  const [forms, setForms] = useState<DynamicFormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<DynamicFormType | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedForm?.formId) {
        localStorage.setItem(`draft-${selectedForm.formId}`, JSON.stringify(formValues));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [formValues, selectedForm]);

  useEffect(() => {
    if (selectedForm?.formId) {
      const saved = localStorage.getItem(`draft-${selectedForm.formId}`);
      if (saved) {
        setFormValues(JSON.parse(saved));
      } else {
        setFormValues({});
      }
    }
  }, [selectedForm]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await apiClient.get("/forms");
        setForms(res.data);
        setSelectedForm(res.data[0]);
      } catch (err) {
        console.error("Error fetching forms:", err);
      }
    };

    fetchForms();
  }, []);

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const requiredFields = selectedForm?.fields ?? [];
    const errors: string[] = [];

    const checkFields = (fields: typeof requiredFields) => {
      for (const field of fields) {
        if (field.conditional) {
          const { fieldId, value } = field.conditional;
          if (formValues[fieldId] !== value) continue;
        }

        if (field.required && !formValues[field.id]) {
          errors.push(`"${field.label}" is required`);
        }

        if (field.children) {
          checkFields(field.children);
        }
      }
    };

    checkFields(requiredFields);
    return errors;
  };
  console.log(forms);
  const handleSubmit = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      alert("Validation Error:\n" + errors.join("\n"));
      return;
    }

    try {
      await apiClient.post("/forms/submit", formValues);
      alert("Form submitted successfully ✅");
      setFormValues({});
    } catch (err) {
      alert("Submission failed ❌");
      console.error(err);
    }
  };

  if (!selectedForm) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md">
      {/* انتخاب فرم */}
      <select
        value={selectedForm?.formId}
        onChange={(e) => {
          const selected = forms.find((f) => f.formId === e.target.value);
          if (selected) {
            setSelectedForm(selected);
          }
        }}
        className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {forms.map((form) => (
          <option key={form.formId} value={form.formId}>
            {form.title}
          </option>
        ))}
      </select>

      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {selectedForm.title} {t("form_title")}
      </h1>

      <DynamicForm fields={selectedForm.fields} values={formValues} onChange={handleChange} />

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
      >
        {t("submit")}
      </button>
    </div>
  );
};

export default FormPage;
