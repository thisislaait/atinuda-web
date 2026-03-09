'use client';

import { FormEvent, useMemo, useState } from 'react';
import styles from './page.module.css';

type MenuOption = {
  title: string;
  description?: string;
};

const CODE_LEGEND = [
  { code: 'PL', meaning: 'Keen on Green, Plant-based' },
  { code: 'VG', meaning: 'Keen on Green, Vegetarian' },
  { code: 'G', meaning: 'Gluten' },
  { code: 'N', meaning: 'Nuts' },
  { code: 'D', meaning: 'Dairy' },
  { code: 'S / SF', meaning: 'Seafood' },
  { code: 'P', meaning: 'Pork' },
  { code: 'A', meaning: 'Alcohol' },
] as const;

const STARTERS: readonly MenuOption[] = [
  { title: 'Traditional hummus (pl)' },
  {
    title: 'Oriental moroccan salad (vg)',
    description: 'Mixed vegetables with lemon and white pepper dressing.',
  },
  {
    title: 'Briouates (g)(sf)',
    description:
      'Trio of crisp, delicate filo pastry sheets filled with minced meat, rice, seafood, chicken, gently baked to a golden finish.',
  },
  {
    title: 'Grilled chicken skewers (d)(g)',
    description: 'Deep fried vegetables, yoghurt, pita bread.',
  },
];

const MAINS: readonly MenuOption[] = [
  {
    title: 'Mixed grill (d)(g) (supplement)',
    description:
      'Angus beef, chicken tawook, lamb kofta, grilled vegetables, biwaz salad, sweet paprika-spiced fries, and garlic paste.',
  },
  {
    title: 'Seafood tagine (sf)',
    description: 'Sea bass tagine with mussels and prawns, marinated in moroccan spices.',
  },
  {
    title: 'Chicken tagine',
    description: 'Braised chicken with onion, garlic, ginger, and saffron, served with preserved lemon and green olives.',
  },
  {
    title: 'Grilled madagascar prawns with moroccan spices (d)(g)(sf)',
    description: 'Served with couscous salad and bbq lemon.',
  },
];

const SIDES: readonly MenuOption[] = [{ title: 'Extra rice' }, { title: 'French fries' }, { title: 'Chilli' }];

const DESSERTS: readonly MenuOption[] = [
  {
    title: 'Bawhara (d)(g)(n)(vg)',
    description:
      'Layers of crisp brick pastry filled with light pastry cream, topped with toasted almonds.',
  },
  {
    title: 'Rice pudding (pl)',
    description: 'Creamy rice pudding infused with citrus zest, served with vanilla ice cream.',
  },
  {
    title: 'Baghir (d)(vg)',
    description: 'Inspired by a moroccan crepe, featuring saffron, diplomat cream, and mixed berries.',
  },
  {
    title: 'Baklava (d)(g)(n)(vg)',
    description: 'Pistachio baklava served with vanilla ice cream.',
  },
];

const DRINKS: readonly MenuOption[] = [
  { title: 'Water' },
  { title: 'White or Red Wine of choice' },
  { title: 'Tea, Expresso or Coffee of choice' },
  { title: 'Gin/Vodka/Tequila of choice' },
];

type SelectionState = {
  firstName: string;
  lastName: string;
  starter: string;
  main: string;
  side: string;
  dessert: string;
  drink: string;
};

const INITIAL_STATE: SelectionState = {
  firstName: '',
  lastName: '',
  starter: '',
  main: '',
  side: '',
  dessert: '',
  drink: '',
};

export default function DinnerWalimerPage() {
  const [selections, setSelections] = useState<SelectionState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState<SelectionState | null>(null);

  const isComplete = useMemo(() => {
    return (
      selections.firstName.trim().length > 0 &&
      selections.lastName.trim().length > 0 &&
      selections.starter.trim().length > 0 &&
      selections.main.trim().length > 0 &&
      selections.dessert.trim().length > 0 &&
      selections.drink.trim().length > 0
    );
  }, [selections]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isComplete) return;
    setSubmitted(selections);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Dinner Walimer Menu Selection</h1>
        <p className={styles.sub}>Select one item from each menu section.</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.row}>
            <div className={styles.group}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                value={selections.firstName}
                onChange={(e) => setSelections((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
                required
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                value={selections.lastName}
                onChange={(e) => setSelections((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <RadioGroup
            id="starter"
            label="Starter"
            value={selections.starter}
            options={STARTERS}
            onChange={(value) => setSelections((prev) => ({ ...prev, starter: value }))}
          />

          <RadioGroup
            id="main"
            label="Main"
            value={selections.main}
            options={MAINS}
            onChange={(value) => setSelections((prev) => ({ ...prev, main: value }))}
          />

          <RadioGroup
            id="side"
            label="Side (Optional)"
            value={selections.side}
            options={SIDES}
            onChange={(value) => setSelections((prev) => ({ ...prev, side: value }))}
          />

          <RadioGroup
            id="dessert"
            label="Dessert"
            value={selections.dessert}
            options={DESSERTS}
            onChange={(value) => setSelections((prev) => ({ ...prev, dessert: value }))}
          />

          <RadioGroup
            id="drink"
            label="Drink"
            value={selections.drink}
            options={DRINKS}
            onChange={(value) => setSelections((prev) => ({ ...prev, drink: value }))}
          />

          <button type="submit" className={styles.submit} disabled={!isComplete}>
            Save Selection
          </button>

          <section className={styles.legend} aria-label="Menu code guide">
            <h2>Code Guide</h2>
            <p>Menu letters mean:</p>
            <ul>
              {CODE_LEGEND.map((item) => (
                <li key={item.code}>
                  <strong>{item.code}</strong>: {item.meaning}
                </li>
              ))}
            </ul>
          </section>
        </form>

        {submitted ? (
          <section className={styles.summary}>
            <h2>Selection Saved</h2>
            <p>
              <strong>Guest:</strong> {submitted.firstName} {submitted.lastName}
            </p>
            <p>
              <strong>Starter:</strong> {submitted.starter}
            </p>
            <p>
              <strong>Main:</strong> {submitted.main}
            </p>
            <p>
              <strong>Side:</strong> {submitted.side || 'Not selected'}
            </p>
            <p>
              <strong>Dessert:</strong> {submitted.dessert}
            </p>
            <p>
              <strong>Drink:</strong> {submitted.drink}
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function RadioGroup({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: keyof SelectionState;
  label: string;
  value: string;
  options: readonly MenuOption[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className={styles.radioGroup}>
      <legend>{label}</legend>
      <div className={styles.radioList}>
        {options.map((option, index) => {
          const inputId = `${String(id)}-${index}`;
          return (
            <label key={option.title} htmlFor={inputId} className={styles.radioOption}>
              <input
                id={inputId}
                type="radio"
                name={String(id)}
                value={option.title}
                checked={value === option.title}
                onChange={(e) => onChange(e.target.value)}
              />
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{option.title}</span>
                {option.description ? <span className={styles.optionDescription}>{option.description}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
