"use client";

import * as React from "react";
import { Input } from "./input";

interface MaskedInputProps extends React.ComponentProps<typeof Input> {
  mask: "cpf" | "cnpj" | "phone";
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, ...props }, ref) => {
    const applyMask = (value: string, type: string) => {
      const cleanValue = value.replace(/\D/g, "");
      
      if (type === "cpf") {
        return cleanValue
          .slice(0, 11)
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      
      if (type === "cnpj") {
        return cleanValue
          .slice(0, 14)
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
      
      if (type === "phone") {
        return cleanValue
          .slice(0, 11)
          .replace(/^(\d{2})(\d)/g, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
      
      return value;
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, mask);
      e.target.value = maskedValue;
      if (onChange) {
        onChange(e);
      }
    };

    return <Input {...props} ref={ref} onChange={handleOnChange} />;
  }
);
MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
