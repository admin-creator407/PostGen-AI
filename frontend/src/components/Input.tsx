import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 bg-[#121417] border ${
          error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-[#1F2328] focus:border-indigo-500 focus:ring-indigo-500/20'
        } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
