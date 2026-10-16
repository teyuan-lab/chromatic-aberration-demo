# Chromatic aberration · Optics lab

[Open the interactive demo](https://teyuan-lab.github.io/chromatic-aberration-demo/)

A dependency-free teaching page in English. Change crown/flint glass, surface radius, illuminated aperture, and screen distance; inspect wavelength-specific back focal distances, exact meridional ray paths, a focus inset, and a geometric screen spot diagram. Turn dispersion off to isolate spherical aberration.

## Physics

Analytic ray–sphere intersections and vector Snell refraction at **both** spherical surfaces; no thin-lens approximation in the traced rays. Symmetric biconvex singlet, R1 = +R, R2 = −R, center thickness 6 mm, physical clear diameter 24 mm. Input light is collimated and on axis. Air index is 1. Lens aperture control specifies illuminated pupil diameter (2–22 mm).

Three-term Sellmeier coefficients for SCHOTT N-BK7 and N-F2; wavelengths 486.1, 546.1 and 656.3 nm. [SCHOTT N-BK7 datasheet](https://media.schott.com/api/public/content/41e799d0bf874807a0bb8e702fbb75b5?v=54856406), [SCHOTT N-F2 datasheet](https://media.schott.com/api/public/content/061f3156c83a44ed9220770b0f65a869?v=d69b35e0).

Back focal distance is the outgoing axis intercept of a ray at height 0.001 mm, measured from the rear vertex. The screen spot uses 700 uniform-area circular-pupil samples per wavelength, rotated from radial traces by rotational symmetry. The fixed ±1 mm spot view reports clipping. RMS radius uses all rays, including those outside the view. Colors are illustrative, not calibrated colorimetry. No diffraction, Fresnel weighting, absorption, or manufacturing errors. This is a geometric spot diagram, not a diffraction PSF or photographic image.

## Run and verify

Open `index.html` in a browser; no build step or dependencies. Or serve this folder with any static HTTP server.

With Node.js: `node verify.cjs`. Checks 162 ray cases across both glasses, radius/aperture extrema and defaults: surface equations, Snell invariants at both surfaces, rotational symmetry, correct color focal ordering, SCHOTT d-line indices, and agreement with an independently calculated paraxial thick-lens back focal distance.

GitHub Pages serves the `main` branch root.
