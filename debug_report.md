## [Issue 1]: Missing CSS utility alias caused build break
- **File:** lib/utils.ts
- **Root Cause:** The project had a shared `cn` helper in `lib/utils.ts`, but the components imported it as `@/utils/cn`, which points to a non-existent file under `src/utils`. Because the alias never resolved, the Next.js app failed during production builds.
- **Solution Applied:** Created a compatibility export at `src/utils/cn.ts` that re-exports the existing `cn` helper, aligning the import path with the project’s usage and restoring the build.

## [Issue 2]: React state was being reset inside an effect
- **File:** src/app/questions/Search.tsx
- **Root Cause:** The component initialized local search state from the URL params and then immediately synchronized it in a `useEffect` on every `searchParams` change. This pattern triggers React warnings and can cause redundant renders or stale UI state when the query string updates.
- **Solution Applied:** Removed the redundant synchronization effect and derived the input state directly from the current URL param at the point of update, preserving a single source of truth without unnecessary state churn.

## [Issue 3]: API handlers used implicit `any` in catch blocks
- **File:** src/app/api/answer/route.ts
- **Root Cause:** The route handlers caught thrown errors as `any`, which violates the project’s TypeScript lint rules and obscures the real runtime error shape. This not only triggered ESLint but also weakened type safety for API failures.
- **Solution Applied:** Replaced the `catch (error: any)` blocks with a typed `unknown` error path and normalized the response handling so message and status extraction stays safe without explicit `any` usage.

## [Issue 4]: Framer Motion exported a removed type API
- **File:** src/components/magicui/shiny-button.tsx
- **Root Cause:** The project was importing `AnimationProps` from `framer-motion`, but the installed version no longer exports that type. Type checking fails immediately because the symbol does not exist in the package’s public API.
- **Solution Applied:** Removed the incompatible `AnimationProps` import and type assertion, leaving the animation config as a plain object that matches the current framer-motion runtime and satisfies TypeScript without depending on the removed export.

## [Issue 5]: Framer Motion transition object used broad string values
- **File:** src/components/magicui/shiny-button.tsx
- **Root Cause:** The animation config passed a plain object with string literals widened to `string`, so TypeScript could not match the stricter `Transition` type expected by `motion.button`. The root issue was the transition object not using literal types for animation mode values like `type` and `repeatType`.
- **Solution Applied:** Applied `as const` to the transition literal strings, narrowing the values to their exact string unions so framer-motion accepts the object without downgrading the type safety contract.

## [Issue 6]: Auth store import used the wrong alias path
- **File:** src/components/ui/floating-navbar.tsx
- **Root Cause:** The app’s `@/*` alias resolves from the project root, but the auth store lives under `src/store/Auth.ts`. The import path `@/store/Auth` pointed to a non-existent module, which caused TypeScript to fail during the production build.
- **Solution Applied:** Updated the import to the project’s actual alias convention (`@/src/store/Auth`) so the compiler resolves the store module correctly.

## [Issue 7]: JSX namespace type was used in a React component prop
- **File:** src/components/ui/floating-navbar.tsx
- **Root Cause:** The component declared `icon?: JSX.Element`, but this project’s TypeScript configuration does not expose the global `JSX` namespace in the way the older pattern expects. That produced a compile-time `Cannot find namespace 'JSX'` error during type checking.
- **Solution Applied:** Replaced the legacy `JSX.Element` annotations with `React.ReactNode`, which matches the project’s React 18/Next.js typing model and preserves the same intent for optional icon content.

## [Issue 8]: Vote document cast skipped TypeScript's unknown-safety guard
- **File:** src/components/VoteButtons.tsx
- **Root Cause:** The component read a generic Appwrite document from `databases.listDocuments()` and cast it directly to the stricter `VoteDocument` shape. Because the base document is a `DefaultDocument` without the required vote fields, TypeScript blocked the assignment as a potentially unsafe conversion.
- **Solution Applied:** Narrowed the cast through `unknown` before assigning to `VoteDocument`, preserving the intended runtime contract while satisfying strict TypeScript checks and keeping the vote lookup logic valid.

## [Issue 9]: Question edit page passed an untyped Appwrite document into a stricter form model
- **File:** src/app/questions/[quesId]/[quesName]/edit/page.tsx
- **Root Cause:** The server route fetched a `DefaultDocument` from Appwrite and passed it directly to the `EditQues` form, but the form expected a `QuestionDoc` with `authorId`, `title`, `content`, and `tags`. TypeScript rejected the mismatch because the runtime object did not actually satisfy the contract at compile time.
- **Solution Applied:** Exported the stricter question shape, narrowed the Appwrite document through `unknown`, and passed the typed object into the editor so the build accepts the data without sacrificing runtime safety.

## [Issue 10]: API error handling relied on untyped `any` values
- **File:** src/app/api/answer/route.ts
- **Root Cause:** The route handlers read `.message`, `.status`, and `.code` directly from `any` values, which violated the lint rule and obscured the real error contract when Appwrite threw a different object shape.
- **Solution Applied:** Replaced `catch (error: any)` with an `unknown` gate that validates the object shape before extracting message/status information and uses safe fallbacks for all failures.

## [Issue 11]: Auth guard redirected signed-in users to the wrong route and left session state unhydrated
- **File:** src/app/(auth)/layout.tsx, src/store/Auth.ts, src/app/ask/page.tsx
- **Root Cause:** The auth layout redirected authenticated users to `/` instead of `/questions`, and the store never refreshed the live Appwrite session on mount. That allowed logged-in users to reach the auth screens and caused protected routes to fall back to the login flow even after a successful sign-in.
- **Solution Applied:** Fixed the redirect target to `/questions`, added a session refresh on auth/protected screens, and marked the auth store as hydrated after verifying the current Appwrite session so protected pages keep the user authenticated instead of sending them back to login.
