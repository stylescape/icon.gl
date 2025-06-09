# Layout Areas

`icon.gl` icons are meticulously designed within a structured layout framework, ensuring consistency and precision across the entire library. This framework is defined using multiple measurement units including Kyū (*q*), millimeters (mm), relative units (rem), and pixels (px), catering to a wide range of design applications from digital to print.

|                   | Kyū (*q*)         | Print (*mm*)      | Display (*rem*)   | Template (*px*)   |
| :---------------- | ----------------: | ----------------: | ----------------: | ----------------: |
| **Canvas Area**   | 24 *q*            | 6 *mm*            | 1.50 *rem*        | 864 *px*          |
| **Live Area**     | 16 *q*            | 4 *mm*            | 1.00 *rem*        | 576 *px*          |
| **Bleed Area**    | 4 *q*             | 2 *mm*            | 0.25 *rem*        | 144 *px*          |

## Detailed Layout Area Specifications

1. **Canvas Area (24 q | 6 mm | 1.50 rem | 864 px)**
   - The **Canvas Area** represents the total graphical boundary of an icon. It is the outermost layer, encompassing all aspects of the icon's design.
   - This area is crucial for maintaining a uniform size across all icons, ensuring they align perfectly in grid layouts and interface designs.
   - Icons must be contained within this area to prevent any part of the design from being inadvertently cropped or clipped in different usage contexts.

2. **Live Area (16 q | 4 mm | 1.00 rem | 576 px)**
   - The **Live Area** is the central zone where the primary elements of an icon are located. This is the focal point of the icon's design.
   - It is designed to ensure that the key components of the icon are always visible and are not obscured by interface elements like navigation bars, sidebars, or overlays.
   - The live area serves as a guide to maintain visual consistency and readability, especially in complex or dense UI environments.

3. **Bleed Area (4 q | 2 mm | 0.25 rem | 144 px)**
   - The **Bleed Area** acts as a buffer zone surrounding the Live Area. It provides additional space for the icon's design elements to extend if necessary, without encroaching on the Canvas Area.
   - This area is particularly useful when an icon requires extra visual emphasis or a more dynamic composition.
   - While the Bleed Area offers flexibility, it's important to use this space judiciously to maintain the icon's clarity and recognizability.

## Enhanced Design Considerations

- **Padding and Margins:** Between each area, there is a carefully calculated padding and margin system. This system ensures that icons have ample breathing room, reducing visual clutter and enhancing legibility.
  
- **Scalability:** The defined areas also aid in scalability. By adhering to these guidelines, icons can be scaled up or down for different applications while retaining their intended visual impact and clarity.

- **Versatility in Application:** Whether for digital interfaces, print media, or mixed media applications, these layout areas provide a versatile foundation. They ensure that icons can be adapted to various contexts without losing their essence.

- **Consistency Across Devices:** The use of multiple units (q, mm, rem, px) ensures that icons maintain their intended appearance across devices and mediums, from high-resolution screens to printed materials.

## Practical Application

- When designing with `icon.gl` icons, consider the context of use. For digital applications, focus on pixel and rem units; for print, refer to mm and q units.
- Use the Canvas Area as a guide for alignment in layouts, ensuring that icons uniformly line up in grids or lists.
- The Live Area is key for icon recognition; prioritize the most important elements of your design here.
- Utilize the Bleed Area for additional decorative elements or to create a more dynamic icon, but always ensure that these elements do not compromise the overall readability.

In summary, the `icon.gl` layout areas provide a robust framework for designing icons that are visually harmonious, easily scalable, and versatile across various applications and devices. These guidelines help designers create icons that are not only aesthetically pleasing but also functionally consistent and recognizably part of the `icon.gl` family.

### Canvas Area

The **Canvas Area** is the complete size of a graphic. No parts of the icon should extend outside of the trim area.

### Live Area

Icon content should remain inside of the **Live Area**, which is the region of an graphic that is unlikely to be hidden from view (such as when sidebars appear upon scrolling).

Icon content is limited to the 20dp x 20dp live area, with 2dp of padding around the perimeter.

### Bleed Area

4q of padding, the **Bleed Area** surrounds the live area.

If additional visual weight is needed, content may extend into the padding between the live area and the **Bleed area** (the complete size of a graphic). No parts of the icon should extend outside of the trim area.
