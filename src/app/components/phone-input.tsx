import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
};

export const countries: Country[] = [
  { 
    code: "AU", 
    name: "Australia", 
    flag: "🇦🇺", 
    dialCode: "+61",
    pattern: /^[2-478]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "4XX XXX XXX"
  },
  { 
    code: "NZ", 
    name: "New Zealand", 
    flag: "🇳🇿", 
    dialCode: "+64",
    pattern: /^[2-9]\d{7,9}$/,
    minLength: 8,
    maxLength: 10,
    placeholder: "21 XXX XXXX"
  },
  { 
    code: "US", 
    name: "United States", 
    flag: "🇺🇸", 
    dialCode: "+1",
    pattern: /^[2-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "202 XXX XXXX"
  },
  { 
    code: "GB", 
    name: "United Kingdom", 
    flag: "🇬🇧", 
    dialCode: "+44",
    pattern: /^[1-9]\d{9,10}$/,
    minLength: 10,
    maxLength: 11,
    placeholder: "20 XXXX XXXX"
  },
  { 
    code: "CA", 
    name: "Canada", 
    flag: "🇨🇦", 
    dialCode: "+1",
    pattern: /^[2-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "204 XXX XXXX"
  },
  { 
    code: "CN", 
    name: "China", 
    flag: "🇨🇳", 
    dialCode: "+86",
    pattern: /^1[3-9]\d{9}$/,
    minLength: 11,
    maxLength: 11,
    placeholder: "138 XXXX XXXX"
  },
  { 
    code: "IN", 
    name: "India", 
    flag: "🇮🇳", 
    dialCode: "+91",
    pattern: /^[6-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "98XXX XXXXX"
  },
  { 
    code: "SG", 
    name: "Singapore", 
    flag: "🇸🇬", 
    dialCode: "+65",
    pattern: /^[3689]\d{7}$/,
    minLength: 8,
    maxLength: 8,
    placeholder: "9XXX XXXX"
  },
  { 
    code: "MY", 
    name: "Malaysia", 
    flag: "🇲🇾", 
    dialCode: "+60",
    pattern: /^1[0-9]\d{7,8}$/,
    minLength: 9,
    maxLength: 10,
    placeholder: "12 XXX XXXX"
  },
  { 
    code: "ID", 
    name: "Indonesia", 
    flag: "🇮🇩", 
    dialCode: "+62",
    pattern: /^8[1-9]\d{7,10}$/,
    minLength: 9,
    maxLength: 12,
    placeholder: "812 XXXX XXXX"
  },
  { 
    code: "TH", 
    name: "Thailand", 
    flag: "🇹🇭", 
    dialCode: "+66",
    pattern: /^[689]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "8X XXX XXXX"
  },
  { 
    code: "VN", 
    name: "Vietnam", 
    flag: "🇻🇳", 
    dialCode: "+84",
    pattern: /^[1-9]\d{8,9}$/,
    minLength: 9,
    maxLength: 10,
    placeholder: "9X XXX XXXX"
  },
  { 
    code: "PH", 
    name: "Philippines", 
    flag: "🇵🇭", 
    dialCode: "+63",
    pattern: /^9\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "9XX XXX XXXX"
  },
  { 
    code: "KR", 
    name: "South Korea", 
    flag: "🇰🇷", 
    dialCode: "+82",
    pattern: /^1[0-9]\d{7,8}$/,
    minLength: 9,
    maxLength: 10,
    placeholder: "10 XXXX XXXX"
  },
  { 
    code: "JP", 
    name: "Japan", 
    flag: "🇯🇵", 
    dialCode: "+81",
    pattern: /^[7-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "90 XXXX XXXX"
  },
  { 
    code: "HK", 
    name: "Hong Kong", 
    flag: "🇭🇰", 
    dialCode: "+852",
    pattern: /^[4-9]\d{7}$/,
    minLength: 8,
    maxLength: 8,
    placeholder: "9XXX XXXX"
  },
  { 
    code: "TW", 
    name: "Taiwan", 
    flag: "🇹🇼", 
    dialCode: "+886",
    pattern: /^9\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "9XX XXX XXX"
  },
  { 
    code: "AE", 
    name: "UAE", 
    flag: "🇦🇪", 
    dialCode: "+971",
    pattern: /^5[0-9]\d{7}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "5X XXX XXXX"
  },
  { 
    code: "SA", 
    name: "Saudi Arabia", 
    flag: "🇸🇦", 
    dialCode: "+966",
    pattern: /^5[0-9]\d{7}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "5X XXX XXXX"
  },
  { 
    code: "DE", 
    name: "Germany", 
    flag: "🇩🇪", 
    dialCode: "+49",
    pattern: /^1[5-7]\d{8,9}$/,
    minLength: 10,
    maxLength: 11,
    placeholder: "151 XXXX XXXX"
  },
  { 
    code: "FR", 
    name: "France", 
    flag: "🇫🇷", 
    dialCode: "+33",
    pattern: /^[67]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "6 XX XX XX XX"
  },
  { 
    code: "IT", 
    name: "Italy", 
    flag: "🇮🇹", 
    dialCode: "+39",
    pattern: /^3\d{8,9}$/,
    minLength: 9,
    maxLength: 10,
    placeholder: "3XX XXX XXXX"
  },
  { 
    code: "ES", 
    name: "Spain", 
    flag: "🇪🇸", 
    dialCode: "+34",
    pattern: /^[67]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "6XX XXX XXX"
  },
  { 
    code: "BR", 
    name: "Brazil", 
    flag: "🇧🇷", 
    dialCode: "+55",
    pattern: /^[1-9]\d{10}$/,
    minLength: 11,
    maxLength: 11,
    placeholder: "11 9XXXX XXXX"
  },
  { 
    code: "MX", 
    name: "Mexico", 
    flag: "🇲🇽", 
    dialCode: "+52",
    pattern: /^[1-9]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "55 XXXX XXXX"
  },
  { 
    code: "ZA", 
    name: "South Africa", 
    flag: "🇿🇦", 
    dialCode: "+27",
    pattern: /^[1-9]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "8X XXX XXXX"
  },
  { 
    code: "NG", 
    name: "Nigeria", 
    flag: "🇳🇬", 
    dialCode: "+234",
    pattern: /^[789]\d{9}$/,
    minLength: 10,
    maxLength: 10,
    placeholder: "80X XXX XXXX"
  },
  { 
    code: "KE", 
    name: "Kenya", 
    flag: "🇰🇪", 
    dialCode: "+254",
    pattern: /^[17]\d{8}$/,
    minLength: 9,
    maxLength: 9,
    placeholder: "7XX XXX XXX"
  },
];

// Validation helper function
export const validatePhoneNumber = (phoneNumber: string, countryCode: string): { isValid: boolean; error?: string } => {
  const country = countries.find(c => c.code === countryCode);
  
  if (!country) {
    return { isValid: false, error: "Invalid country code" };
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if empty
  if (!digitsOnly) {
    return { isValid: false, error: "Phone number is required" };
  }
  
  // Check minimum length
  if (country.minLength && digitsOnly.length < country.minLength) {
    return { isValid: false, error: `Phone number must be at least ${country.minLength} digits for ${country.name}` };
  }
  
  // Check maximum length
  if (country.maxLength && digitsOnly.length > country.maxLength) {
    return { isValid: false, error: `Phone number must not exceed ${country.maxLength} digits for ${country.name}` };
  }
  
  // Check pattern if defined
  if (country.pattern && !country.pattern.test(digitsOnly)) {
    return { isValid: false, error: `Please enter a valid ${country.name} phone number` };
  }
  
  return { isValid: true };
};

interface PhoneInputProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string, countryCode: string) => void;
  defaultCountry?: string;
  error?: string;
  hasValue?: boolean;
  name?: string;
  "data-gf-field-id"?: string;
}

export function PhoneInput({
  id,
  placeholder,
  value = "",
  onChange,
  defaultCountry = "AU",
  error,
  hasValue = false,
  name,
  "data-gf-field-id": dataGfFieldId
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];
  const dynamicPlaceholder = placeholder || currentCountry.placeholder || "Enter phone number";
  
  // Extract phone number from value when it changes
  useEffect(() => {
    if (value) {
      // Try to find which country code matches
      const matchedCountry = countries.find(country => value.startsWith(country.dialCode));
      if (matchedCountry) {
        setSelectedCountry(matchedCountry.code);
        setPhoneNumber(value.replace(matchedCountry.dialCode, "").trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    
    // Combine country code with phone number
    const fullNumber = newPhoneNumber ? `${currentCountry.dialCode} ${newPhoneNumber}` : "";
    onChange?.(fullNumber, selectedCountry);
  };

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    const newCountry = countries.find(c => c.code === code);
    if (newCountry) {
      // Clear phone number when changing country to prevent invalid formats
      setPhoneNumber("");
      const fullNumber = "";
      onChange?.(fullNumber, code);
    }
  };

  return (
    <div className="flex gap-2">
      <Select
        value={selectedCountry}
        onValueChange={handleCountryChange}
      >
        <SelectTrigger className={`!w-[140px] !h-auto !px-[16px] !pt-[18px] !pb-[8px] !text-[18px] !rounded-[8px] !outline-none !transition-all !bg-[#F4F4F4] !font-bariol !gap-1 ${
          error
            ? '!border-2 !border-[#ED1C24]'
            : '!border !border-[#F4F4F4]'
        }`}>
          <SelectValue>
            <div className="flex items-center gap-1">
              <span className="text-[20px] leading-none">{currentCountry.flag}</span>
              <span className="text-[18px] font-bariol">{currentCountry.dialCode}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code} className="font-bariol">
              <div className="flex items-center gap-2">
                <span className="text-xl">{country.flag}</span>
                <span className="text-[18px]">{country.name}</span>
                <span className="text-muted-foreground text-[16px]">{country.dialCode}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        required
        id={id}
        name={name}
        data-gf-field-id={dataGfFieldId}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className={`flex-1 px-[16px] pt-[18px] pb-[8px] text-[18px] border font-bariol rounded-[8px] outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-[#F4F4F4] ${
          error
            ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
            : 'text-black border-[#F4F4F4]'
        }`}
      />
    </div>
  );
}