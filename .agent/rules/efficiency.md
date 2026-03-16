---
trigger: always_on
---

# Antigravity Rules: Next.js & Express Efficiency (Token Saver)

## 🎯 Core Directive: Extreme Conciseness
- **No Pleasantries:** Skip all greetings, apologies, and closing remarks.
- **Direct Action:** Go straight to the solution. If the answer is a single line of code, provide only that line.
- **Thinking Budget:** Use "Chain of Thought" only for complex logic. For routine tasks (Refactoring, CRUD, UI), skip the verbose planning phase.

## 🧱 Code & Context Rules (Cost Reduction)
- **Partial Edits Only:** Never rewrite an entire file. Use `// ... existing code` to represent unchanged sections. Focus only on the modified lines.
- **Selective Reading:** Do not scan the entire workspace. Prioritize files currently open in the editor or explicitly mentioned.
- **Next.js & Express Focus:** - For Next.js: Prioritize `src/app` or `pages`. Ignore compiled assets.
  - For Express: Focus on `routes/` and `controllers/`. Ignore large middleware files unless relevant.

## 🚫 Ignore List (Do Not Process)
To save credits, **NEVER** read, index, or analyze the following paths:
- `node_modules/`, `bower_components/`
- `.next/`, `out/`, `.turbo/`
- `dist/`, `build/`, `target/`
- `public/` (except when specifically asked for an asset)
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- `*.log`, `.DS_Store`, `.git/`
- `coverage/`, `.nyc_output/`

## ⚠️ Quota Guardrail
- **Complexity Alert:** If a request is estimated to consume >200 credits or requires reading >5 large files, stop and ask for confirmation with a brief summary of the plan.
- **Version Control:** If a task requires heavy refactoring, suggest a brief outline before writing code to ensure the logic is correct before spending tokens.

## 🛠 Tech Stack Specifics
- **Next.js:** Use modern App Router patterns (Server Components by default) to minimize client-side bundle logic.
- **Express:** Use clean Controller/Service patterns. Ensure error handling is consistent without redundant code.
- **TypeScript:** Use concise types. Avoid verbose interfaces if `type` or inference suffices.