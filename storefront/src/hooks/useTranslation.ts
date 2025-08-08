import { translations, type TranslationKeys } from '@/lib/translations';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & (string | number)];

type TranslationPath = NestedKeyOf<TranslationKeys>;

export const useTranslation = (locale: string = 'lt') => {
  const t = (key: TranslationPath, params?: Record<string, string | number>): string => {
    const translation = translations[locale as keyof typeof translations];
    
    if (!translation) {
      console.warn(`Translation locale '${locale}' not found`);
      return key;
    }
    
    // Navigate to nested key
    const keys = key.split('.');
    let value: any = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key '${key}' is not a string`);
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce((text, [param, replacement]) => {
        return text.replace(new RegExp(`{{${param}}}`, 'g'), String(replacement));
      }, value);
    }
    
    return value;
  };

  return { t };
};