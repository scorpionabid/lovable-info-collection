
import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
];

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('az');

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    // Here you would implement actual language change functionality
    console.log(`Language changed to ${langCode}`);
  };

  return (
    <div className="py-1">
      <div className="px-3 py-2 text-sm font-medium text-infoline-dark-gray border-b border-infoline-light-gray">
        Dil seçimi
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
              currentLang === lang.code 
                ? "bg-infoline-light-gray text-infoline-dark-blue" 
                : "hover:bg-infoline-light-gray text-infoline-dark-gray"
            )}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <div className="flex items-center gap-2">
              <span>{lang.nativeName}</span>
            </div>
            {currentLang === lang.code && <Check size={16} className="text-infoline-blue" />}
          </button>
        ))}
      </div>
    </div>
  );
};
