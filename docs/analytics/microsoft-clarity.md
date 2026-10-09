# Microsoft Clarity

The site has a privacy-conscious Clarity loader in `src/lib/clarity.ts`. It injects the official asynchronous Clarity tag only when the public `VITE_CLARITY_PROJECT_ID` build variable is present. No project ID is committed to the repository, and no Clarity request is made in builds where the variable is empty.

## Enable it for a deployment

1. Create or open the site in Microsoft Clarity and copy its project ID.
2. Add `VITE_CLARITY_PROJECT_ID` to the local `.env.local` and the Vercel Production environment.
3. Redeploy. The loader runs after the browser is idle, so it does not block the first render.
4. Open the Clarity project and confirm a test session appears. Clarity can take a few hours to populate the dashboard.

The project ID is a public identifier, not a secret. Do not add user IDs, emails, prompts, file names, image URLs or Firebase tokens to Clarity custom identifiers. This integration does not call `identify` or send custom tags.

## Masking boundary

Clarity masks form values by default. We additionally mark user-upload previews, second-image previews, generated results, before/after workspaces and selected file names with `data-clarity-mask="true"`. Public, site-owned showcase images remain visible so recordings can still explain the navigation and conversion flow.

The page already has a privacy policy entry for Clarity. If the consent or analytics policy changes, update the policy before enabling the production project ID.

## Verification

- Build with the variable empty and confirm the generated bundle evaluates the project ID to an empty string and does not append a Clarity script or make a `clarity.ms/tag/` request.
- Build with a test project ID and confirm one script with id `microsoft-clarity-script` is added after idle; navigation must not add a second script.
- In a signed-out and signed-in session, confirm image previews and result workspaces are masked in Clarity recordings and that no `identify` call is made.
