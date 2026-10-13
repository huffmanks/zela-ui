import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "zu-combobox": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
