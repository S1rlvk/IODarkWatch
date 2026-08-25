# IODarkWatch

A demo/portfolio maritime-surveillance dashboard for the Indian Ocean, showcasing dark-vessel detection concepts on simulated data.

## Language

**Dark Vessel**:
A vessel physically detected by satellite imagery (SAR/optical) whose position has no matching AIS broadcast — evidence the vessel is deliberately or accidentally untracked.
_Avoid_: using this term for AIS-only anomalies (transmission gaps, speed/position mismatches) — see AIS Gap and Spoofing Signature.

**AIS Gap**:
A previously active vessel whose AIS transponder has stopped transmitting for 12+ hours. Evidence of a silent transponder — the vessel may still be visible to AIS, just not currently.
_Avoid_: Dark Vessel, AIS silence.

**Spoofing Signature**:
A vessel whose AIS-reported speed and position are mutually inconsistent — e.g. speed reported as 0 while position keeps changing, or calculated speed differing sharply from reported speed (includes erratic/impossible speed swings). Evidence of a lying transponder, distinct from a silent one.
_Avoid_: Dark Vessel, suspicious movement, erratic movement (as a separate category).
