# Material models and sources

All wavelengths in equations in `optics.js` are in µm. Sellmeier coefficients are stored with squared resonance wavelengths as C: n² = 1 + Σ B λ²/(λ² − C). The ZnS model is a modified dispersion equation. All ray-traced wavelengths (486.1, 546.1, 656.3 nm) and comparison wavelengths (d 587.5618, F 486.1327, C 656.2725 nm) are inside the models' visible ranges. Values below are calculated from the coded models, not empirical measurements of a particular specimen.

| Material | nd | nF − nC | Vd | Model / conditions |
|---|---:|---:|---:|---|
| Fluorite (CaF₂) | 1.43388 | 0.00456 | 95.19 | Daimon & Masumura (2002), synthetic sample, 20 °C; 0.138–2.326 µm |
| Fused silica | 1.45846 | 0.00676 | 67.82 | Malitson (1965), amorphous silica, 20 °C; 0.21–3.71 µm |
| N-BK7 | 1.51680 | 0.00805 | 64.17 | SCHOTT datasheet |
| Diamond | 2.41563 | 0.02531 | 55.93 | Turri et al. (2017), CVD type IIa, 0.3–1.65 µm; index accuracy ±0.002 |
| Water | 1.33349 | 0.00598 | 55.75 | Daimon & Masumura (2007), distilled water, 19 °C; 0.182–1.129 µm |
| N-F2 | 1.62005 | 0.01702 | 36.43 | SCHOTT datasheet |
| Cubic zirconia (YSZ) | 2.15877 | 0.03455 | 33.54 | Wood & Nassau (1982), 12.0 mol% Y₂O₃, 25 °C; 0.361–5.135 µm |
| N-SF66 | 1.92286 | 0.04420 | 20.88 | SCHOTT datasheet |
| Cubic ZnS (sphalerite) | 2.36769 | 0.08864 | 15.43 | Debenham (1984), Klein (1986), 20 °C; 0.405–13 µm |

Vd = (nd − 1)/(nF − nC). A lower Vd indicates stronger relative dispersion. The visible Δn of ZnS is about eleven times that of N-BK7, whereas N-SF66 is about 5.5 times. Focal separation also depends on lens power and geometry, so it must not be ranked solely by Δn. Gemological B–G dispersion uses different spectral lines and should not be substituted for F–C here.

## Primary references

- [SCHOTT N-BK7 datasheet](https://media.schott.com/api/public/content/41e799d0bf874807a0bb8e702fbb75b5?v=54856406).
- [SCHOTT N-F2 datasheet](https://media.schott.com/api/public/content/061f3156c83a44ed9220770b0f65a869?v=d69b35e0).
- [SCHOTT N-SF66 datasheet](https://media.schott.com/api/public/content/c2e0c3a77dcb4c94b349424ee621ee32?v=3320661c).
- I. H. Malitson, [Interspecimen comparison of the refractive index of fused silica](https://doi.org/10.1364/JOSA.55.001205), JOSA 55, 1205–1208 (1965).
- M. Daimon & A. Masumura, [High-accuracy measurements of the refractive index and its temperature coefficient of calcium fluoride](https://doi.org/10.1364/AO.41.005275), Applied Optics 41, 5275–5281 (2002).
- G. Turri et al., [Index of refraction from the near-ultraviolet to the near-infrared from a single crystal microwave-assisted CVD diamond](https://commons.erau.edu/publication/666/), Optical Materials Express 7, 855 (2017). One-term model B = 4.658, resonance wavelength 0.1125 µm.
- M. Daimon & A. Masumura, [Measurement of the refractive index of distilled water from the near-infrared region to the ultraviolet region](https://doi.org/10.1364/AO.46.003811), Applied Optics 46, 3811–3820 (2007).
- M. Debenham, [Refractive indices of zinc sulfide in the 0.405–13-µm wavelength range](https://doi.org/10.1364/AO.23.002238), Applied Optics 23, 2238–2239 (1984); C. A. Klein, [Room-temperature dispersion equations for cubic zinc sulfide](https://doi.org/10.1364/AO.25.001873), Applied Optics 25, 1873–1875 (1986). Formula also reproduced in [an optical prism study, Eq. 11](https://doi.org/10.1186/s41476-018-0077-9).
- D. L. Wood & K. Nassau, [Refractive index of cubic zirconia stabilized with yttria](https://doi.org/10.1364/AO.21.002978), Applied Optics 21, 2978–2981 (1982). Distinguish nd ≈ 2.15877 at 587.5618 nm from reported ND = 2.15847 at the sodium D line near 589.3 nm.

Coefficient transcriptions for the research datasets were cross-checked against the [RefractiveIndex.INFO public-domain database](https://refractiveindex.info/), with the original studies linked above. Sources use slightly different index-reference conventions; the demo retains an ambient index of exactly 1 and does not claim metrological accuracy across datasets.

Natural fluorite, diamond, and sphalerite share the represented cubic material structures, but optical-quality fits do not reproduce impurities, color, inclusions, or absorption in arbitrary specimens. Fused silica is amorphous; it is not a scalar model of crystalline quartz. Water is an ideal fixed-shape lens without container surfaces. YSZ is a synthetic stabilized cubic zirconia, not zircon (ZrSiO₄) or monoclinic baddeleyite. No birefringent materials are included.
