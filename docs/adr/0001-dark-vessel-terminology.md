---
status: accepted
---

# Dark Vessel means satellite-AIS correlation, not AIS behavior alone

Two competing definitions of "dark vessel" had grown up in the repo: the README described a vessel seen by satellite with no matching AIS broadcast, while the actual detection code (and `DARK_VESSEL_DETECTION.md`) flagged vessels as "dark" purely from their own AIS behavior — 12+ hour transmission silence, or speed/position values that don't add up. Both were being written into a single `isDark` field.

We considered three options: keep the AIS-behavior definition since that's what the code already does; keep the satellite-correlation definition since that's what the project name and README promise; or split them into distinct concepts. We chose the split: **Dark Vessel** is reserved for the satellite-detected/no-AIS-match case, while the AIS-only signals are now **AIS Gap** (silent transponder) and **Spoofing Signature** (lying transponder — inconsistent speed/position, including erratic swings). These are genuinely different kinds of evidence with different implications, and collapsing them into one boolean was the direct cause of the doc/code disagreement.

Consequence: the current codebase's `isDark` flag is built entirely on AIS-behavior logic and doesn't implement a real Dark Vessel per this definition (no satellite correlation exists anywhere in the repo). The live demo represents Dark Vessel with mocked satellite-correlation scenarios rather than the current `isDark` logic.
