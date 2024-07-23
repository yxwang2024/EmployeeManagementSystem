import React from 'react';
import { useField, FieldHookConfig } from 'formik';

interface CustomFileProps extends FieldHookConfig<string> {
  label: string;
  label2?: string;
  type?: string;
  disabled?: boolean;
}

const CustomFile: React.FC<CustomFileProps> = ({ label, label2, type = 'text', disabled = false, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'file' && event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const base64 = await convertToBase64(file);
      helpers.setValue(base64);
      helpers.setError(undefined);
    } else {
      field.onChange(event);
      helpers.setValue(event.currentTarget.value);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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

export default CustomFile;