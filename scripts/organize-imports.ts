import { ImportDeclaration, Project } from "ts-morph";

const files = process.argv.slice(2);
if (files.length === 0) process.exit(0);

const project = new Project({
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFilesAtPaths(files);

for (const file of project.getSourceFiles()) {
  const imports = file.getImportDeclarations();
  if (imports.length === 0) continue;

  const minIndex = Math.min(
    ...imports.map((importDecl: ImportDeclaration) =>
      importDecl.getChildIndex()
    )
  );

  const sideEffectImports: ImportDeclaration[] = [];
  const namedImports: ImportDeclaration[] = [];
  const mixedImports: ImportDeclaration[] = [];
  const defaultImports: ImportDeclaration[] = [];

  for (const imp of imports) {
    const defaultImport = imp.getDefaultImport();
    const clause = imp.getImportClause();

    // Side-effect: import 'foo'; (no clause)
    if (!clause) {
      sideEffectImports.push(imp);
      continue;
    }

    const namedBindings = clause.getNamedBindings(); // NamedImports or NamespaceImport
    const isNamespace =
      namedBindings && namedBindings.getKindName() === "NamespaceImport";

    const hasNamedStructure =
      namedBindings && namedBindings.getKindName() === "NamedImports";

    if (isNamespace) {
      // Namespace: import * as N from 'a' -> No {}. Group with Default.
      defaultImports.push(imp);
    } else if (hasNamedStructure) {
      if (defaultImport) {
        // Named + Default -> Mixed
        mixedImports.push(imp);
      } else {
        // Named only
        namedImports.push(imp);
      }
    } else {
      // No NamedStructure (so Default only)
      defaultImports.push(imp);
    }
  }

  const sortFn = (a: ImportDeclaration, b: ImportDeclaration) => {
    return a
      .getModuleSpecifierValue()
      .localeCompare(b.getModuleSpecifierValue());
  };

  sideEffectImports.sort(sortFn);
  namedImports.sort(sortFn);
  mixedImports.sort(sortFn);
  defaultImports.sort(sortFn);

  const sortedImports: ImportDeclaration[] = [
    ...sideEffectImports,
    ...namedImports,
    ...mixedImports,
    ...defaultImports,
  ];

  sortedImports.forEach((imp: ImportDeclaration, index: number) => {
    imp.setOrder(minIndex + index);
  });

  const lastImport = sortedImports[sortedImports.length - 1];
  if (lastImport) {
    const nextSibling = lastImport.getNextSibling();
    if (nextSibling) {
      const start = lastImport.getEnd();
      const end = nextSibling.getStart();
      const gap = file.getFullText().slice(start, end);
      
      // Ensure at least one blank line (two newlines)
      if (!gap.includes('\n\n') && !gap.includes('\r\n\r\n')) {
        file.insertText(start, "\n");
      }
    }
  }

  file.saveSync();
}
