"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CKEditorField } from "./ckeditor";

interface FormCKEditorProps {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export function FormCKEditor({
  control,
  name,
  label,
  description,
  placeholder,
  minHeight = "400px",
  className = "",
}: FormCKEditorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <CKEditorField
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={placeholder}
              minHeight={minHeight}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 