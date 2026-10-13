---
id: no-python-default
scope: tooling
title: Use the project's tech stack — reach for its AST/type-aware tools before generic string manipulation or a Python fallback
priority: must
appliesToKeywords:
  - python
  - python3
  - pip
  - uv
  - pipx
  - venv
  - virtualenv
  - requirements.txt
  - pyproject
  - sed
  - awk
  - regex
  - rename
  - refactor
  - reorganize
  - move file
  - update imports
  - rewrite imports
  - codemod
  - migration
created: 2026-07-24
---

**Why:** The reflexive failure mode isn't just "reach for Python" — it's "ignore the project's ecosystem and fall back to generic string hacks." Both come from the same instinct: solve the problem with the most familiar hammer instead of the tool the project already carries. Concrete example: in a TypeScript project, reorganizing files means updating imports. The robust answer is `ts-morph` (AST-aware, type-checked, handles re-exports and aliases). The reflexive answer is `sed`/`awk`/regex or a Python script — which will silently break relative paths, miss aliased imports, and won't touch `.d.ts` re-exports. The regex fix looks like it worked; the bug ships.

Before writing any tooling command, script, or one-off transformation, ask in order:

1. **Does the project's ecosystem already have a purpose-built tool?**
   - TypeScript/JavaScript refactors → `ts-morph`, `jscodeshift`, `@codemod/cli`
   - Rust refactors → `cargo fix`, `rust-analyzer`'s codemods
   - Go refactors → `gofmt -r`, `gopls`, `go/ast`
   - Java refactors → OpenRewrite, IntelliJ structural search
   - SQL migrations → the project's migration tool (`prisma migrate`, `atlas`, `flyway`), never hand-crafted `ALTER`s
   - Package version bumps → the project's package manager (`pnpm up`, `cargo update`), not editing `package.json` by hand
   - Structured data (JSON/YAML/TOML) → `jq`, `yq`, `dasel`
2. **If not, can a shell-native tool do it cleanly?** `fish` / `bash` / `grep` / `rg` / `fd` / `sd`.
3. **Language-specific work in an unfamiliar stack?** Use that ecosystem's tools, not a generic scripting fallback.
4. **Last resort:** ask the user. Python is off the table unless the project itself is Python (`pyproject.toml`, `requirements.txt`, `setup.py`).

**The two smells that mean you're violating this rule:**
- You're about to write a regex or `sed` command that transforms *code* (not text). Code has structure; use it.
- You're about to write `python3 -c "..."` or a `.py` script in a non-Python project.

**Example — TypeScript import rewrite:**

```bash
# BAD — regex misses aliased imports, re-exports, .d.ts, multi-line imports
find src -name '*.ts' -exec sed -i 's|from "./old/utils"|from "./new/utils"|g' {} +

# GOOD — ts-morph, AST-aware
npx ts-node -e '
  import { Project } from "ts-morph";
  const p = new Project({ tsConfigFilePath: "tsconfig.json" });
  p.getSourceFiles().forEach(sf =>
    sf.getImportDeclarations().forEach(d => {
      if (d.getModuleSpecifierValue() === "./old/utils")
        d.setModuleSpecifier("./new/utils");
    })
  );
  p.save();
'
```

**When you genuinely can't find the ecosystem tool:** say so, propose the shell-native fallback, and ask the user to confirm before running. Don't silently downgrade to string hacks.
