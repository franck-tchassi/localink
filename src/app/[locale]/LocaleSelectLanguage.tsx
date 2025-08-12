"use client";

import { useState } from 'react';
import { useChangeLocale, useCurrentLocale, useI18n } from '../../locales/client';
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import Image from 'next/image';

const languages = [
  { code: 'en', flag: 'gb', name: 'English-EN' },
  { code: 'fr', flag: 'fr', name: 'Français-FR' },
  { code: 'de', flag: 'de', name: 'Deutsch-DE' },
  { code: 'es', flag: 'es', name: 'Español-ES' },
  { code: 'it', flag: 'it', name: 'Italiano-IT' },
  { code: 'pt', flag: 'pt', name: 'Português-PT' },
  { code: 'sa', flag: 'sa', name: 'العربية-SA' } 
];

interface LocaleSelectLanguageProps {
  mobile?: boolean;
}

const LocaleSelectLanguage = ({ mobile = false }: LocaleSelectLanguageProps) => {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const t = useI18n();
  const [changingLocale, setChangingLocale] = useState<string | null>(null);
  
  const currentFlag = languages.find((l) => l.code === locale)?.flag || "gb";

  const handleLocaleChange = (newLocale: any) => {
    setChangingLocale(newLocale);
    changeLocale(newLocale);
    
    setTimeout(() => {
      setChangingLocale(null);
    }, 500);
  };

  if (mobile) {
    return (
      <div className="w-full">
        <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
          {t("language.Language")}
        </div>
        <div className="space-y-1">
          {languages.map(({code, flag, name}) => (
            <Button
              key={code}
              variant="ghost"
              onClick={() => handleLocaleChange(code)}
              className={`w-full justify-start px-3 py-2 rounded-md ${
                locale === code ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`fi fi-${flag} rounded mr-2`}></span>
              <span className="text-sm">{name}</span>
              {changingLocale === code && (
                <span className="ml-auto h-3 w-3  border-gray-400 border-t-black animate-spin rounded-full"></span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 px-3 cursor-pointer border-none">
          <div className="w-5 h-5 relative">
            <Image
              src={`/flags/${currentFlag}.svg`}
              alt={locale}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-sm font-medium">
            {t("currentLanguage")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-48 p-1 cursor-pointer"
        align="end"
        sideOffset={8}
      >
        {languages.map(({code, flag, name}) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLocaleChange(code)}
            className={`flex items-center cursor-pointer ${
              locale === code ? 'bg-gray-100' : ''
            }`}
          >
            <span className={`fi fi-${flag} rounded mr-2`}></span>
            <span className="text-sm">{name}</span>
            {changingLocale === code && (
              <span className="ml-auto h-3 w-3 border-2 border-gray-400 border-t-black animate-spin rounded-full"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSelectLanguage;