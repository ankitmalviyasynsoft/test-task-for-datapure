'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  useThemeCustomization,
  FontFamily,
  ThemeColor,
  RadiusSize,
  BorderWidth,
} from '../../contexts/ThemeCustomizationContext';
import { Check, RotateCcw, Type, Palette, Square, BoxSelect } from 'lucide-react';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useThemeCustomization();

  const fonts: { id: FontFamily; label: string; desc: string; sample: string }[] = [
    { id: 'inter', label: 'Inter', desc: 'Modern & Clean', sample: 'Aa' },
    { id: 'plus-jakarta', label: 'Plus Jakarta Sans', desc: 'Geometric & Elegant', sample: 'Aa' },
    { id: 'roboto', label: 'Roboto', desc: 'Friendly & Readable', sample: 'Aa' },
    { id: 'outfit', label: 'Outfit', desc: 'Contemporary & Bold', sample: 'Aa' },
    { id: 'system', label: 'System Default', desc: 'Native OS font', sample: 'Aa' },
  ];

  const colors: { id: ThemeColor; label: string; bgClass: string }[] = [
    { id: 'indigo', label: 'Indigo', bgClass: 'bg-[#6366f1]' },
    { id: 'violet', label: 'Violet', bgClass: 'bg-[#8b5cf6]' },
    { id: 'blue', label: 'Blue', bgClass: 'bg-[#2563eb]' },
    { id: 'emerald', label: 'Emerald', bgClass: 'bg-[#10b981]' },
    { id: 'rose', label: 'Rose', bgClass: 'bg-[#f43f5e]' },
    { id: 'amber', label: 'Amber', bgClass: 'bg-[#d97706]' },
  ];

  const radiuses: { id: RadiusSize; label: string; radiusStyle: string }[] = [
    { id: 'none', label: 'Sharp', radiusStyle: 'rounded-none' },
    { id: 'sm', label: 'Subtle', radiusStyle: 'rounded-sm' },
    { id: 'md', label: 'Medium', radiusStyle: 'rounded-md' },
    { id: 'lg', label: 'Smooth', radiusStyle: 'rounded-xl' },
    { id: 'full', label: 'Pill / Round', radiusStyle: 'rounded-2xl' },
  ];

  const borders: { id: BorderWidth; label: string; desc: string }[] = [
    { id: 'thin', label: 'Thin', desc: 'Subtle light lines' },
    { id: 'normal', label: 'Default', desc: 'Standard balanced border' },
    { id: 'thick', label: 'Accent', desc: 'High contrast 2.5px border' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Theme & Appearance Settings"
      description="Customize your typography, global theme color, corner radius, and border thickness."
      maxWidth="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Font Family Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Font Family</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {fonts.map((f) => {
              const isSelected = settings.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateSettings({ fontFamily: f.id })}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-light/50 dark:bg-primary/20 text-slate-900 dark:text-white shadow-xs ring-1 ring-primary'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200">
                      {f.sample}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{f.label}</div>
                      <div className="text-[11px] text-slate-400">{f.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Accent Theme Color */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Primary Accent Color</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {colors.map((c) => {
              const isSelected = settings.themeColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateSettings({ themeColor: c.id })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-light/50 dark:bg-primary/20 shadow-xs ring-1 ring-primary'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${c.bgClass} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Corner Radius */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Square className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Corner Radius</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {radiuses.map((r) => {
              const isSelected = settings.radius === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => updateSettings({ radius: r.id })}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-light/50 dark:bg-primary/20 text-primary font-bold shadow-xs ring-1 ring-primary'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 border-2 border-current mb-1.5 ${r.radiusStyle}`} />
                  <span className="text-[11px] truncate w-full">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Border Thickness */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BoxSelect className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Border Styling</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {borders.map((b) => {
              const isSelected = settings.borderWidth === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => updateSettings({ borderWidth: b.id })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-light/50 dark:bg-primary/20 text-primary font-bold shadow-xs ring-1 ring-primary'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{b.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{b.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={resetSettings}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>Reset to default</span>
        </button>
        <Button size="sm" onClick={onClose} className="px-5">
          Done
        </Button>
      </div>
    </Modal>
  );
};
