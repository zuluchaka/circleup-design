# Tailwind Color Configuration

## Color Choices

- **Primary:** `indigo` — Used for buttons, links, key accents, active navigation states
- **Secondary:** `amber` — Used for tags, highlights, notification badges, warnings
- **Neutral:** `slate` — Used for backgrounds, text, borders, navigation chrome

## Usage Examples

### Primary (Indigo)
```
Primary button: bg-indigo-600 hover:bg-indigo-700 text-white
Primary link: text-indigo-600 hover:text-indigo-700
Active nav: bg-indigo-50 text-indigo-700
Primary badge: bg-indigo-100 text-indigo-800
Focus ring: ring-indigo-500
```

### Secondary (Amber)
```
Secondary badge: bg-amber-100 text-amber-800
Warning alert: bg-amber-50 border-amber-200 text-amber-800
Notification dot: bg-amber-500
Highlight: bg-amber-100
```

### Neutral (Slate)
```
Body text: text-slate-700 dark:text-slate-300
Muted text: text-slate-500 dark:text-slate-400
Headings: text-slate-900 dark:text-slate-100
Borders: border-slate-200 dark:border-slate-700
Background: bg-slate-50 dark:bg-slate-900
Card: bg-white dark:bg-slate-800
```

### Dark Mode

All colors should have dark mode variants:
```
bg-white dark:bg-slate-900
text-slate-900 dark:text-slate-100
border-slate-200 dark:border-slate-700
bg-indigo-600 dark:bg-indigo-500
```
