import React from 'react';
import { Select } from '../ui/select';

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      className="w-40 border-2 border-black"
    >
      <option value="developer">Developer</option>
      <option value="writer">Technical Writer</option>
      <option value="reviewer">Code Reviewer</option>
      <option value="architect">System Architect</option>
    </Select>
  );
};