/** Stable public slugs for the verified passport/document photo specifications. */
export const PASSPORT_PHOTO_SPEC_PATHS: Record<string, string> = {
  '3-na-4': 'ru-doc-3x4',
  '35x45-ru': 'ru-passport-35x45',
};

export const PASSPORT_PHOTO_SPEC_SLUGS: Record<string, string> = {
  'ru-doc-3x4': '3-na-4',
  'ru-passport-35x45': '35x45-ru',
};

export const PASSPORT_PHOTO_PATHS = [
  '/tools/passport-photo',
  ...Object.values(PASSPORT_PHOTO_SPEC_SLUGS).map(slug => `/tools/passport-photo/${slug}`),
] as const;

export const PASSPORT_PHOTO_LONG_FORM = {
  definition: 'A passport or document photo maker prepares an image for a published physical size, resolution and head-position guide. This browser tool performs the crop and print layout locally, so the source photo stays on the device. It does not decide whether an immigration office, employer or other authority will accept the final image.',
  workflow: 'Choose the exact verified format first, then load a clear front-facing photo. The guide shows the target head height and headroom; adjust zoom and position until the crown and chin sit inside those lines. Select the output DPI, export one exact-size photo or lay out repeated copies on a printable sheet, and keep the original for any later correction.',
  quality: 'The source should be sharp enough to print at the selected DPI, evenly lit and free from strong shadows, glare, sunglasses or cropped hair where the receiving authority prohibits them. A larger pixel count cannot repair a hidden eye, an obscured face or a background that fails the destination rule.',
  verification: 'The specification table records the printed dimensions, minimum DPI, background guidance and source date for each published format. Rules can change, and different authorities can interpret the same size differently. Confirm the current receiving authority instructions before you submit a photo or print sheet.',
  privacy: 'Local processing means the browser reads the selected file and draws the crop to a canvas on this device. The tool does not need an account, credits or a server upload to make the printable output. Clear the page or close the tab when finished if you are using a shared computer, and keep any downloaded copy in a location you control.',
  troubleshooting: 'If the export looks soft, start with a larger original and choose the minimum DPI required by the specification rather than enlarging a tiny screenshot. If the head does not fit the guide, adjust the crop before changing the output size. If a sheet is clipped by a printer, check the printer page size and disable “fit to page” so the physical dimensions remain exact.',
  limitations: 'This is a layout and crop utility, not an automatic compliance or biometric checker. It does not remove a background, change an expression, certify identity or submit a file to an authority. Those decisions belong to the person submitting the photo and to the authority that publishes the requirement.',
  printNotes: 'For a physical sheet, use the paper size selected in the tool and print at 100 percent. Printer dialogs often add a “fit”, “shrink” or borderless option; those settings can change the millimetres even when the PNG itself is correct. Measure one printed tile with a ruler before making a full batch, especially when the receiving office has a strict size check.',
  privacyNotes: 'The tool is designed for a one-off local task: select a file, make the crop, download the output and clear the workspace. It does not require an account, does not send the source image to the enhancement API and does not retain a history of local exports. Treat the downloaded PNG like any other identity document and avoid leaving it in a public downloads folder.',
  checklist: 'A reliable final check is simple: confirm the selected format, confirm the printed millimetres, measure the exported tile, inspect the face and background at 100 percent, and compare the result with the authority’s current checklist. If any one of those answers is uncertain, keep the source and correct the crop before printing more copies. Save the exact specification and DPI alongside the file name so you can tell two similar exports apart later, especially when a family or team needs several formats. This avoids reprinting a whole sheet because a small setting was forgotten. For an important application, print one test tile first and have the applicant check the expression, hairline and background under normal light. Keep a note of the office or application type, because a visually similar document photo can still have a different size, head-height range or background rule. This final note makes a later recheck faster.',
} as const;
