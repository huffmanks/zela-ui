// import "@zela/ui";
import "../../../packages/ui/src/index.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="page">
    <header class="page-header">
      <p class="eyebrow">Zela UI · Component playground</p>
      <h1>Combobox</h1>
      <p class="intro">A searchable list of options built as a framework-agnostic custom element.</p>
    </header>

    <section class="demo" aria-labelledby="basic-example">
      <h2 id="basic-example">Basic example</h2>
      <p>Type to filter the available options. Use the arrow keys to navigate and Enter to select.</p>
      <label class="field-label" for="country-combobox">Country</label>
      <zu-combobox id="country-combobox" name="country" label="Country" placeholder="Search countries" multiple clearable required>
        <option value="ca">Canada</option>
        <option value="jp">Japan</option>
        <option value="nz">New Zealand</option>
        <option value="gb">United Kingdom</option>
        <option value="us">United States</option>
      </zu-combobox>
      <p class="selection" aria-live="polite">Selected value: <output id="selected-value">none</output></p>
    </section>

    <section class="demo" aria-labelledby="markup-example">
      <h2 id="markup-example">HTML</h2>
      <pre><code>&lt;zu-combobox name="country" placeholder="Search countries"&gt;
  &lt;option value="us"&gt;United States&lt;/option&gt;
  &lt;option value="ca"&gt;Canada&lt;/option&gt;
&lt;/zu-combobox&gt;</code></pre>
    </section>
    <section class="demo" aria-labelledby="advanced-example">
      <h2 id="advanced-example">Advanced example</h2>
      <p>Type to filter the available options. Use the arrow keys to navigate and Enter to select.</p>
      <label class="field-label" for="country-combobox">Country</label>
      <zu-combobox multiple clearable size="sm" name="countries">
  <optgroup label="North America">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="uk">United Kingdom</option>
    <option value="fr">France</option>
  </optgroup>
</zu-combobox>
      <p class="selection" aria-live="polite">Selected value: <output id="selected-value">none</output></p>
    </section>

    <section class="demo" aria-labelledby="markup-example">
      <h2 id="markup-example">HTML</h2>
      <pre><code>&lt;zu-combobox multiple clearable size="sm" name="countries"&gt;
  &lt;optgroup label="North America"&gt;
    &lt;option value="us"&gt;United States&lt;/option&gt;
    &lt;option value="ca"&gt;Canada&lt;/option&gt;
  &lt;/optgroup&gt;
  &lt;optgroup label="Europe"&gt;
    &lt;option value="uk"&gt;United Kingdom&lt;/option&gt;
    &lt;option value="fr"&gt;France&lt;/option&gt;
  &lt;/optgroup&gt;
&lt;/zu-combobox&gt;</code></pre>
    </section>
  </main>
`;

const combobox = document.querySelector("zu-combobox");
const output = document.querySelector<HTMLOutputElement>("#selected-value");

combobox?.addEventListener("change", () => {
  if (output && combobox instanceof HTMLElement && "value" in combobox) {
    output.value = String((combobox as HTMLElement & { value: string }).value || "none");
  }
});
