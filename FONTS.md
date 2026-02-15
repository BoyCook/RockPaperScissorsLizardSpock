# Font Configuration

## Current Font

**Exo 2** - A bold, modern video game-style font with clean geometric lines.

- **Source:** Google Fonts (via `next/font/google`)
- **Weights:** 400, 500, 600, 700, 800, 900
- **Style:** Bold, geometric, gaming aesthetic without pixelation
- **Similar to:** Supply Center font (https://www.fontspace.com/supply-center-font-f89906)

## Implementation

Located in `src/app/layout.tsx`:

```typescript
import { Exo_2 } from 'next/font/google';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-exo2',
});

// Applied to body with className={`${exo2.variable} antialiased`}
```

Applied in `src/app/globals.css`:

```css
body {
  font-family: var(--font-exo2), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
}
```

## Alternative Gaming Fonts

If you want to try a different style, here are other great options:

### Sci-Fi/Futuristic
- **Orbitron** - Geometric, futuristic, angular
  ```typescript
  import { Orbitron } from 'next/font/google';
  ```

### Retro Arcade
- **Audiowide** - Retro gaming feel, clean and readable
  ```typescript
  import { Audiowide } from 'next/font/google';
  ```

### Bold/Impact
- **Russo One** - Very bold, impactful, great for titles
  ```typescript
  import { Russo_One } from 'next/font/google';
  ```

### Military/Industrial
- **Teko** - Condensed, military-style, similar to stencil fonts
  ```typescript
  import { Teko } from 'next/font/google';
  ```

## How to Change Font

1. Update `src/app/layout.tsx`:
   - Change the import: `import { NewFont } from 'next/font/google';`
   - Update the font configuration
   - Update the variable name if desired

2. Update `src/app/globals.css`:
   - Change the CSS variable reference to match

3. Test with: `npm test -- --run && npm run lint`

## Resources

- [Google Fonts](https://fonts.google.com/)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Supply Center Font (inspiration)](https://www.fontspace.com/supply-center-font-f89906)
