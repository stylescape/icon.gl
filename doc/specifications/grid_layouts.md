# Grid Layouts

The grid layout in `icon.gl` serves as the backbone for designing icons, providing a structured yet flexible framework. This system ensures that all graphic elements are aligned and proportioned consistently, resulting in a coherent set of icons.

## Detailed Grid Specifications

1. **Grid Divisions and Measurements:**
   - The grid is divided into several key divisions: 8x, 12x, 16x, 24x, 32x, 36x, and 72x. Each division offers a different scale, allowing for precise placement and sizing of icon elements.
   - The divisions are mapped across different measurement units – Pixels (px), Kyū (*q*), Millimeters (mm), and Relative Units (rem) – to cater to various design needs, whether digital or print.

2. **Canvas Grid:**
   - The Canvas Grid is the largest, spanning 864 px in the template size. It breaks down into smaller divisions (108 px, 72 px, etc.) for detailed design work.
   - This grid is essential for establishing the overall boundary and scale of the icon, ensuring consistent sizing across the icon set.

3. **Live Area Grid:**
   - The Live Area Grid, smaller than the Canvas Grid at 576 px, is crucial for the main content of the icon. This area ensures that the most important parts of the icon are highlighted and easily recognizable.
   - The smaller divisions within this grid help designers align and size elements within the icon effectively, maintaining visual balance.

4. **Bleed Grid:**
   - The Bleed Grid, the smallest at 144 px, provides additional space around the Live Area. This is particularly useful for creating icons that require a bit more visual flair without compromising the core design.
   - This grid is especially useful for ensuring that extended elements or decorative features do not encroach on the Live Area.

## Application in Icon Design

- **Grid Adaptability:** The grid system in `icon.gl` is designed to be adaptable, allowing designers to choose the appropriate grid size and line thickness based on the complexity and style of the icon.
  
- **Scalability and Consistency:** These grids ensure that icons are scalable across different platforms while maintaining consistency in visual style and proportions.

- **Flexibility in Design:** While the grids provide a structured framework, they are flexible enough to accommodate creativity and innovation in icon design.

In conclusion, the expanded grid layouts for `icon.gl` provide a comprehensive and versatile framework for designing icons. This system ensures that icons are not only visually appealing but also consistent and scalable across various applications. By adhering to these guidelines, designers can create icons that are both functional and aesthetically pleasing, enhancing the overall user experience.

|                   | Template          | 8 *x*     | 12 *x*    | 16 *x*    | 24 *x*    | 32 *x*    | 36 *x*    | 72 *x*    |
| :---------------- | ----------------: | --------: | --------: | --------: | --------: | --------: | --------: | --------: |
| **Canvas**        | 864 *px*          | 108 *px*  | 72 *px*   | 54 *px*   | 36 *px*   | 27 *px*   | 24 *px*   | 12 *px*   |
| **Live Area**     | 576 *px*          | 72 *px*   | 48 *px*   | 36 *px*   | 24 *px*   | 18 *px*   | 16 *px*   |  8 *px*   |
| **Bleed**         | 144 *px*          | 18 *px*   | 12 *px*   |  9 *px*   |  6 *px*   |  4.5 *px* |  4 *px*   |  2 *px*   |
