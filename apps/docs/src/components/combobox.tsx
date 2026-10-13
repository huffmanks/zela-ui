import "@zela/ui";

import { useEffect, useRef } from "react";

type ComboboxProps = {
  placeholder?: string;
  disabled?: boolean;
};

export function Combobox({ placeholder = "Choose a framework", disabled = false }: ComboboxProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    element.setAttribute("placeholder", placeholder);
    element.toggleAttribute("disabled", disabled);
  }, [placeholder, disabled]);

  return (
    <div className="combobox">
      <zu-combobox ref={ref}>
        <option value="astro">Astro</option>
        <option value="react">React</option>
        <option value="svelte">Svelte</option>
        <option value="vue">Vue</option>
      </zu-combobox>
    </div>
  );
}
