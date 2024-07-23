import React from 'react';
import { useField } from 'formik';

interface CustomCheckboxProps {
  name: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, onChange, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={field.value}
          {...field}
          {...props}
          onChange={(e) => {
            field.onChange(e);
            if (onChange) onChange(e);
          }}
          className="form-checkbox h-5 w-5 text-gray-600"
        />
        <span className="ml-2 text-gray-700 text-md md:text-lg">{label}</span>
      </label>
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-sm">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default CustomCheckbox;