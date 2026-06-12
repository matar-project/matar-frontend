import {
  getCountryCallingCode,
  getCountries,
} from 'react-phone-number-input';
import ar from 'react-phone-number-input/locale/ar';

export const COUNTRY_OPTIONS = getCountries()
  .map((code) => ({
    value: code,
    label: `${ar[code] ?? code} (+${getCountryCallingCode(code)})`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'ar'));
