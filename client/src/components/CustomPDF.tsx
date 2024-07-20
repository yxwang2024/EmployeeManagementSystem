import React from 'react';
import { useField } from 'formik';

interface CustomPDFProps {
  name: string;
  label: string;
  label2?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomPDF: React.FC<CustomPDFProps> = ({ label, label2, type = 'text', disabled = false, onChange, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'file' && event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const FILE_SIZE = 10 * 1024 * 1024; // 3 MB
      const SUPPORTED_FORMATS = ["image/pdf"];

      if (file) {
        if (!SUPPORTED_FORMATS.includes(file.type)) {
          helpers.setError('Please upload as PDF');
        } else if (file.size > FILE_SIZE) {
          helpers.setError('Max size 10 MB');
        } else {
          helpers.setValue(file);
          helpers.setError(undefined); 
        }
      }
    } else {
      field.onChange(event);
      helpers.setValue(event.currentTarget.value);
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-md md:text-lg font-normal mb-2">
        {label} 
        {label2 && <span className='text-gray-600 ml-4 text-sm md:text-md'>{label2}</span>}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 text-md md:text-lg leading-tight focus:outline-none focus:shadow-outline ${
          meta.touched && meta.error ? 'border-red-500' : ''
        }`}
        type={type}
        disabled={disabled}
        onChange={handleChange}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-sm italic text-end">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default CustomPDF;
