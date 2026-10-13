import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = resolve(root, "src/components");
const generatedDir = resolve(root, "src/generated");
const declarationPath = resolve(generatedDir, "elements.d.ts");

async function getTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  return (
    await Promise.all(
      entries.map(async (entry) => {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) return getTypeScriptFiles(path);
        if (entry.isFile() && /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
          return [path];
        }

        return [];
      })
    )
  ).flat();
}

function moduleSpecifier(fromFile, toFile) {
  let path = relative(dirname(fromFile), toFile)
    .split(sep)
    .join("/")
    .replace(/\.tsx?$/, ".js");

  if (!path.startsWith(".")) path = `./${path}`;

  return path;
}

const registrations = [];

for (const file of await getTypeScriptFiles(componentsDir)) {
  const source = ts.createSourceFile(
    file,
    await readFile(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(source) === "customElements" &&
      node.expression.name.text === "define" &&
      node.arguments.length >= 2 &&
      ts.isStringLiteral(node.arguments[0]) &&
      ts.isIdentifier(node.arguments[1])
    ) {
      const tag = node.arguments[0].text;
      const className = node.arguments[1].text;
      const declaration = source.statements.find(
        (statement) => ts.isClassDeclaration(statement) && statement.name?.text === className
      );

      if (!declaration) {
        throw new Error(`Cannot resolve class "${className}" registered as "${tag}" in ${file}`);
      }

      registrations.push({ tag, className, file });
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
}

if (!registrations.length) {
  throw new Error(
    `No customElements.define(tag, ClassName) registrations found in ${componentsDir}`
  );
}

const tags = new Set();

for (const registration of registrations) {
  if (tags.has(registration.tag)) {
    throw new Error(`Duplicate custom-element registration: "${registration.tag}"`);
  }

  tags.add(registration.tag);
}

const domImports = registrations.map(
  ({ className, file }, index) =>
    `import type { ${className} as Element${index} } from "${moduleSpecifier(declarationPath, file)}";`
);

const domTypes = registrations.map(({ tag }, index) => `    "${tag}": Element${index};`).join("\n");

await mkdir(generatedDir, { recursive: true });

await writeFile(
  declarationPath,
  `${domImports.join("\n")}

declare global {
  interface HTMLElementTagNameMap {
${domTypes}
  }
}

export {};
`
);

console.log(`Generated DOM types for ${registrations.length} custom elements.`);
