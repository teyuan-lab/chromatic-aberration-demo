# Chromatic aberration · Optics lab

[Open the interactive demo](https://teyuan-lab.github.io/chromatic-aberration-demo/)

A dependency-free teaching page in English. Choose from nine materials: N-BK7, N-F2, N-SF66, fused silica, fluorite, diamond, distilled water, sphalerite (cubic ZnS), and cubic zirconia (yttria-stabilized ZrO₂). Change surface radius, illuminated aperture, and screen distance; inspect wavelength-specific back focal distances, exact meridional ray paths, a focus inset, and a geometric screen spot diagram. Turn dispersion off to isolate spherical aberration.

A visible n(λ) curve spans 450–700 nm, with the three ray wavelengths marked. Its vertical axis adjusts to each material. When dispersion is disabled, the material curve remains and a dashed line identifies the constant tracing index n(546.1 nm).

## Achromatic doublet example

Select **Achromatic doublet · N-BK7 + N-F2**. An educational cemented prescription has three actual refracting surfaces, a positive N-BK7 crown element (5 mm center thickness), and a negative N-F2 flint element (3 mm). R1 = +R and R2 = −R. The rear curvature is numerically solved using paraxial transfer to match the F (486.1 nm) and C (656.3 nm) back focal planes, including finite thickness. Exact spherical ray tracing then checks and displays the resulting paths. Cement has zero thickness in the model; there is no air gap or separate cement layer.

At R = 50 mm: R3 ≈ −1629.89 mm; blue/red BFL ≈ 109.27227 mm, green BFL ≈ 109.20639 mm. The remaining ≈0.06588 mm green offset is the secondary spectrum. This prescription corrects paraxial color; it is **not optimized for spherical aberration**. Large apertures can therefore retain visible geometric blur.

A focal-shift curve compares the doublet against an N-BK7 singlet of the same green BFL and aperture (singlet R ≈ 114.32913 mm and thickness 6 mm at the default doublet setting). Each curve is referenced to its green focus. This avoids attributing differences in focal distance to color correction. The n(λ) plot shows both constituent materials: neither glass has become nondispersive. With dispersion off, both glass indices are held at their own 546.1 nm value.

The **Low dispersion: fluorite** shortcut selects the lowest-dispersion material in this catalogue (Vd ≈ 95.19). Low relative dispersion reduces chromatic error but does not make a singlet achromatic. [Achromat background: Edmund Optics](https://www.edmundoptics.co.uk/knowledge-center/application-notes/optics/why-use-an-achromatic-lens/).

## Physics

Analytic ray–sphere intersections and vector Snell refraction at **both** spherical surfaces; no thin-lens approximation in the traced rays. Symmetric biconvex singlet, R1 = +R, R2 = −R, center thickness 6 mm, physical clear diameter 24 mm. Input light is collimated and on axis. Air index is 1. Lens aperture control specifies illuminated pupil diameter (2–22 mm).

Published dispersion equations; wavelengths 486.1, 546.1 and 656.3 nm. See [material models, conditions and sources](MATERIALS.md). The comparison table uses standard Fraunhofer wavelengths to compute nd, nF − nC, and Vd. Strong-dispersion examples include N-SF66 (Vd ≈ 20.88) and cubic ZnS (Vd ≈ 15.43). Cubic zirconia is specifically ZrO₂ stabilized with 12 mol% Y₂O₃ at 25 °C (Vd ≈ 33.54). The diamond model uses a CVD specimen. No claim is made that arbitrary natural specimens have optical-grade transmission.

Back focal distance is the outgoing axis intercept of a ray at height 0.001 mm, measured from the rear vertex. The screen spot uses 700 uniform-area circular-pupil samples per wavelength, rotated from radial traces by rotational symmetry. The fixed ±1 mm spot view reports clipping. RMS radius uses all first-pass transmitted rays, including those outside the view. High-index materials at large apertures can undergo total internal reflection: those meridional traces terminate with a marker at the rear surface, and the screen reports the excluded pupil fraction. Subsequent internal bounces are not traced. Colors are illustrative, not calibrated colorimetry. No diffraction, Fresnel weighting, absorption, or manufacturing errors. This is a geometric spot diagram, not a diffraction PSF or photographic image. The water lens has an ideal fixed shape with no container.

The screen range (5–250 mm from rear vertex) covers all singlet and doublet focal distances over the radius controls. Changing material or lens example refocuses the screen to green; radius and aperture controls retain screen position. All crystal models are cubic and scalar. The n = 1 surrounding medium is an educational idealization; source datasets have slightly differing air/vacuum/nitrogen reference conditions.

## Run and verify

Open `index.html` in a browser; no build step or dependencies. Or serve this folder with any static HTTP server.

With Node.js: `node verify.cjs`. Checks 729 ray cases across all nine materials, radius/aperture extrema and defaults: surface equations, Snell invariants at both surfaces, TIR conditions (8 cases), rotational symmetry, correct color focal ordering, reference indices, dispersion properties, screen range, and agreement with an independently calculated paraxial thick-lens back focal distance.

An additional 594 doublet ray cases cover all 66 radius settings (35–100 mm), three wavelengths, and three pupil heights. They check surface intersections and Snell invariants at all three interfaces, exact-ray agreement with paraxial transfer, positive element thickness, F/C focus matching, secondary spectrum, the matched singlet comparison, and screen coverage.

GitHub Pages serves the `main` branch root.
