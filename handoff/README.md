# Handoff — material for the paper and presentation

Everything here is for the write-up and the deck, not for the website. Nothing
in this folder is imported by the app or included in the build.

## What's here

| File | For | Give to |
| --- | --- | --- |
| [`tables.md`](tables.md) | Two paste-ready tables: the cross-case matrix and the payment-outcomes table | Whoever owns the paper |
| [`prose-additions.md`](prose-additions.md) | Drafted contribution statement + affiliate-displacement paragraph, in the paper's voice | Whoever owns the paper |
| [`demo-script.md`](demo-script.md) | New demo slide, a timed 60-second script, which slides to compress, appendix plan | You — this is your section |
| [`figures/`](figures/) | Figures 1 and 2 as PNG and SVG, light and dark | Both |

## Figures

| File | Use |
| --- | --- |
| `extortion-model-light.png` | **Paper.** Figure 1, drops straight into Google Docs |
| `extortion-model-dark.png` | **Deck.** Matches the site and the slide template |
| `lineage-light.png` | **Paper.** Figure 2 |
| `lineage-dark.png` | **Deck.** |
| `*.svg` | Vector originals — use these if anything needs resizing or recoloring |

PNGs are rendered at 2× (3360 px wide) so they stay sharp in print and on a
projector. In Google Docs insert the PNG, then set width to full margin;
do not stretch beyond 100%.

**Captions** are already burned into the bottom of each figure, but your Docs
style may want them as real caption text instead. If so, crop the last line out
and retype it below the image so it picks up the document's caption style.

## Regenerating

Edit the data at the top of [`figures/build.mjs`](figures/build.mjs), then:

```bash
node handoff/figures/build.mjs
```

That rewrites the four SVGs. To refresh the PNGs, re-render each SVG with
headless Chrome at 2× (canvas is 1680×560 for the extortion figure, 1680×688
for the lineage figure):

```bash
chrome --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1680,560 \
  --screenshot=extortion-model-light.png extortion-model-light.svg
```

## Before this goes in

Three things need a decision from the group, not from me:

1. **Change Healthcare payment figures** (~$22M, the affiliate dispute) come
   from security reporting, not a UnitedHealth filing. Label the row as reported
   the way the paper already labels the MGM service-desk account.
2. **HSE recovery cost** — I wrote it qualitatively rather than attaching a
   number. Put a figure in only if you have a source you will cite.
3. **The lineage paragraph** deliberately avoids vendor-reported statistics so
   it stands on your existing sources. If you want the numbers, cite them at the
   same standard as the rest of the paper.
