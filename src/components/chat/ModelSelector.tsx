import React from 'react';
import { Select } from '../ui/select';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      className="w-40 border-2 border-black"
    >
      <option value="gpt-4">GPT-4</option>
      <option value="gpt-3.5">GPT-3.5</option>
      <option value="claude">Claude</option>
    </Select>
  );
};