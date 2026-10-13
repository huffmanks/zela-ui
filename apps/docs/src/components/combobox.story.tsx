import { defineStory } from "../lib/story";
import { Combobox } from "./combobox";

export const story = defineStory({
  Component: Combobox,
  args: {
    initial: {
      placeholder: "Choose a framework",
      disabled: false,
    },
  },
});
