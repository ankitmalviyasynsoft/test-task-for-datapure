'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      name,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      id,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      controlledValue !== undefined ? controlledValue : defaultValue || (options[0]?.value ?? '')
    );
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
    const selectedOption = options.find((opt) => String(opt.value) === String(currentValue));

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (val: string) => {
      if (disabled) return;
      if (controlledValue === undefined) {
        setInternalValue(val);
      }
      if (onChange) {
        onChange({ target: { value: val, name } });
      }
      setIsOpen(false);
    };

    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full relative" ref={containerRef}>
        {/* Hidden input to support React Hook Form register ref & values */}
        <input
          type="hidden"
          ref={ref}
          name={name}
          value={currentValue}
          id={generatedId}
          required={required}
        />

        {label && (
          <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            'w-full flex items-center justify-between text-left rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm transition-all duration-150 py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 select-none shadow-xs',
            error
              ? 'border-rose-400 focus:border-rose-500 ring-rose-200'
              : isOpen
              ? 'border-primary ring-2 ring-primary/20 dark:ring-primary/30'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
            disabled && 'bg-slate-50 dark:bg-slate-800/60 opacity-60 cursor-not-allowed',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate flex items-center gap-2">
            {selectedOption?.icon}
            <span className={!selectedOption ? 'text-slate-400' : 'font-medium'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-2',
              isOpen && 'rotate-180 text-primary'
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full min-w-[140px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-1.5 animate-slide-up focus:outline-none">
            <div className="max-h-60 overflow-y-auto space-y-0.5" role="listbox">
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(currentValue);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none',
                      isSelected
                        ? 'bg-primary-light/60 text-primary dark:bg-primary/20 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
