---
tier: core
target_keyword: neural redraw checklist
landing_page: /before-after
why_this_brings_people: Readers comparing style-conversion results need to know where text, identity and geometry can change before accepting a visual reference.
date: 2026-10-23
---
# A neural redraw checklist: use style conversion without losing track of what changed

Style conversion can make another lighting and material direction visible from an existing image. Review small text, symbols, identity, and proportions separately so a useful visual reference does not silently become evidence for details the redraw changed.

## TL;DR

- Judge the intended visual direction and preservation requirements separately.
- Keep complete sources and outputs, including failed or provisional results.
- Inspect lettering, emblems, recognizable features, and spatial relationships before approval.
- Our recorded room examples support observations about those images, not a universal fidelity claim.

## Review the change you asked for

A neural redraw checklist starts with the creative task. In these examples the task was to reinterpret lighting and material appearance in existing interior renders. The purpose was to make a visual direction available for discussion while keeping the source arrangement available for comparison.

That is the A-line capability: DLSS 5-style conversion and neural-render redraw. The useful outcome might be a reference for daylight, indirect illumination, fabric response, or surface contrast. It is not defined by a desktop application's packaging, and it does not require pretending that the generated scene is a faithful photograph of a real room.

Our [before-and-after page](https://www.dlss5nvidia.com/before-after) provides the relevant comparison context. This article adds a way to record which parts of a result remain suitable for reference and which parts must not be carried into a final design. A boundary note is useful when it changes that decision.

## The records behind the pictures

The included room and kitchen pairs come from recorded site-owned flux-klein jobs dated October 21. Their original inputs, returned outputs, prompts, and task records are retained. We copied the existing comparisons without changing the light, color, or content to manufacture a stronger difference.

The historical review treated these as lighting-direction candidates with visible departures, not as approved geometric reconstructions. That status stays attached here. We did not rerun those model jobs for this article, and we do not turn a successful API status into a passed visual review.

![Site-owned bedroom render beside its recorded lighting and material redraw](assets/room-compare.jpg)

*Figure 1. Preserved comparison from the October 21 room task. Source: site-owned sample2 render and the actual flux-klein output; license: own, authorized for this batch. Original run record is room-run.json. This was a provisional lighting reference, not a geometry-fidelity pass.*

The bedroom remains recognizable, while the bedding appearance, artwork, and some cabinet details differ. Those are specific places to inspect against the source. The room's broad familiarity does not establish exact preservation of a decorative motif or the relationship between furniture and the surrounding architecture.

## Small text: compare meaning before appearance

### Inspect characters as characters

A caption, appliance label, sign, or interface control communicates information. In a style redraw it can also become visual texture. The review must therefore ask whether the actual characters survived, not whether the mark looks sufficiently like writing from a normal viewing distance.

In the kitchen pair, the upper interface overlay and appliance labels remain available to inspect. We do not certify the wording of tiny text from the comparison image. Use the supplied full files and the source wording, if known, rather than treating plausible output lettering as a transcript.

If a letter cannot be verified, mark it unresolved. That is different from claiming that it definitely changed. If a clear source character becomes a different character, record the mismatch. A useful checklist distinguishes observed errors from places where the available image cannot support a judgment.

### Keep annotations outside generated pixels

Write the task identifier and review decision in the surrounding document. If you place them inside an image and send that image through another redraw, they become part of the generated scene. The audit trail should remain readable independently of the model's treatment of text.

For a presentation, you can supply a separate caption describing the creative direction. Do not use an invented label in the image as evidence of a product name or a historical fact. A visual reference can still serve its purpose while the editor explicitly excludes its lettering from reuse.

## Logos and symbols: shape alone is insufficient

A logo may remain recognizable while its letter spacing, internal cutouts, or proportions change. The same applies to a fictional emblem that a character designer wants preserved. Check the mark against the authorized source artwork, including the space around it, rather than approving it because the color is familiar.

Our room examples do not provide a verified brand-logo test. We include logo inspection as an acceptance criterion for readers whose own sources contain such marks. We do not invent a successful logo-preservation experiment from an appliance label that cannot be verified here.

A generated symbol also does not establish permission to use it commercially. The relevant practical step is to keep the source and ask the responsible owner or designer to approve the final mark where needed. This is an editorial review recommendation, not a legal determination.

![Recorded kitchen source and redraw with interface text and appliance details visible](assets/kitchen-compare.jpg)

*Figure 2. Existing comparison from the October 21 kitchen task, copied unchanged. Source: site-owned sample1 render and its real flux-klein output; license: own. kitchen-run.json preserves the request. Text, tap, and appliance shapes require review; the result was not approved for direct publication as a faithful scene.*

## Identity: familiarity needs a separate check

A recognizable person or character has more than a broad silhouette. Face shape, hairline, expression, distinctive marks, and costume construction can matter to recognition. A change that seems minor to the editor may be obvious to the person pictured or the character's designer.

These interior examples contain no faces. They cannot establish facial identity preservation, nor can they tell you how a face-oriented tool behaves. For an authorized portrait, compare against the original and seek the subject's review before treating the result as an acceptable representation.

Keep the identity question separate from whether the rendering looks attractive. You can like the light while rejecting a changed expression. For a fictional character, the same logic applies to a helmet, badge, hairstyle, or costume seam that carries the design's identity.

## Exact proportions: a concept is not a measurement

A room can look credible while the apparent size of the bench, the placement of a cabinet seam, or the relation between window and wall changes. A plausible perspective does not prove that furniture fits. If a decision depends on dimensions, retain measured information outside the generated picture.

The bedroom record requests preservation of the arrangement. Its review nevertheless identifies changes in artwork, pillow patterns, cabinet layout, and some spatial proportions. The appropriate conclusion is that the image can inform a lighting discussion while remaining unsuitable as evidence of exact geometry.

Do not convert that observation into a percentage of geometric accuracy. We did not establish a calibrated camera, measured reference scene, or numerical registration experiment. The record supports a visual comparison and named concerns, which are sufficient to decide that a stricter geometry claim has not been demonstrated.

## Repeat the inspection we actually performed

1. Open room-run.json and kitchen-run.json to read the original task descriptions and successful completion records.
2. View each complete source beside its returned output. The package retains separate input and output files as well as the comparison images.
3. Check the bedroom artwork, bedding, and cabinet lines, then the kitchen overlay, tap, and appliance outlines.
4. Separate direct observations from unverified text and untested face or logo behavior.
5. Record whether each image remains useful as a visual-direction reference and which elements are excluded from reuse.

We also reused the library's reproduce-capture.mjs script on a local page containing the recorded comparisons. Its execution log and manifest are included. The procedure reproduces the inspection surface; it does not create a new inference result or simulate a successful preservation test.

Open assets/audit.html to inspect the same embedded comparisons. To rerun the browser capture, follow the environment instructions in assets/README.md and execute the supplied script from that directory. We ran that script for this package. Any new model experiment would require its own request and returned file, so it is outside this replay.

## Write a decision someone else can use

A review note should name the intended visual change, the region checked, what was observed, and the permitted use. For the bedroom, a reader can discuss material response while retaining a concern about decorative and geometric differences. A generic approved stamp would discard that useful distinction.

For text, use separate outcomes such as verified against source, mismatch observed, and not readable enough to verify. For identity, distinguish a subject-approved result from an editor's impression. For proportions, distinguish a visual plausibility check from a measurement. These labels describe the evidence rather than pretending every task has the same threshold.

The neural redraw checklist is intended to keep useful creative work moving. A result that fails one requirement may still be an honest reference for another purpose, provided the recipient can see the limitation. Reclassifying the use is acceptable; hiding the failure is not a substitute for review.

## Technical context and limits

BFL's [image-editing guide](https://docs.bfl.ml/flux_2/flux2_image_editing) describes prompt-based edits, and its [multi-reference overview](https://help.bfl.ai/articles/6546682167-what-is-multi-reference-editing) explains combining reference content. Those pages give background, not independent validation of these recorded outputs. No images from either source appear here.

Use this neural redraw checklist before calling an output a finished reference. It cannot guarantee unchanged words, logos, identity, proportions, commercial suitability, or temporal stability. This article concerns independent static style conversion, not NVIDIA runtime output. We operate the linked site and are not affiliated with NVIDIA, AMD, or Black Forest Labs. The original files remain the basis for every review.
