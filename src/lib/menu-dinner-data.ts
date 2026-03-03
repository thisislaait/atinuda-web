import { BEL_OMBRE_OPTIONS, LABOURDONNAIS_OPTIONS } from '@/lib/menu-options';

export type MealProfile = {
  madeWith: string[];
  tasteProfile: string;
  allergyCaution: string[];
  bestExperiencedWith?: string;
  bestFor?: string;
};

export type CourseChoice = {
  optionId: string;
  title: string;
  teaser?: string;
  image: string;
  profile: MealProfile;
};

export type CourseBlock = {
  id: string;
  title: string;
  note?: string;
  venue: 'belombre' | 'labourdonnais';
  courseKey: 'starter' | 'main' | 'dessert';
  choices: CourseChoice[];
};

export type DinnerBlock = {
  id: string;
  tabTitle: string;
  heading: string;
  whenWhere: string;
  intro?: string;
  arrivalExperience?: {
    title: string;
    snacks: string[];
    bar?: string;
  };
  courses: CourseBlock[];
  staticNotes?: string[];
};

export const DINNER_BLOCKS: DinnerBlock[] = [
  {
    id: 'd3-bel-ombre',
    tabTitle: 'Day 4 Dinner',
    heading: 'CHATEAU BEL OMBRE',
    whenWhere: 'Curated Dining Experience',
    intro:
      'An elevated coastal-inspired menu blending Mauritian ingredients with refined international technique.',
    courses: [
      {
        id: 'bel-starter',
        title: 'Starter Selection',
        note: 'Please select one.',
        venue: 'belombre',
        courseKey: 'starter',
        choices: [
          {
            optionId: 'bel-starter-prawns-ravioli',
            title: BEL_OMBRE_OPTIONS.starter[0],
            teaser: 'King Prawns Ravioli · Fricasseed Moringa',
            image: '/assets/images/foodmenu/prawnrav.jpg',
            profile: {
              madeWith: ['King prawns', 'Pasta', 'Moringa leaves', 'Light seafood jus'],
              tasteProfile:
                'Delicate ravioli filled with king prawns, served with lightly fricasseed moringa for a subtle earthiness and vibrant finish.',
              allergyCaution: ['Shellfish', 'Gluten'],
              bestExperiencedWith: 'Chilled Sauvignon Blanc or dry Rose',
              bestFor: 'Guests who enjoy refined seafood with gentle herbal notes.',
            },
          },
          {
            optionId: 'bel-starter-smoked-marlin',
            title: BEL_OMBRE_OPTIONS.starter[1],
            teaser: 'Palm Heart · Passion Fruit',
            image: '/assets/images/foodmenu/marlinpalm.jpg',
            profile: {
              madeWith: ['Smoked marlin (fish)', 'Palm heart', 'Passion fruit', 'Greens'],
              tasteProfile:
                'Lightly smoked marlin paired with fresh palm heart and bright passion fruit for a balanced, tropical profile.',
              allergyCaution: ['Fish'],
              bestExperiencedWith: 'Sparkling wine or citrus-infused tonic',
              bestFor: 'Guests who prefer fresh, vibrant, lightly smoked flavours.',
            },
          },
          {
            optionId: 'bel-starter-tuna-tataki',
            title: BEL_OMBRE_OPTIONS.starter[2],
            teaser: 'Avocado & Wasabi Puree · Squid Ink · Tapioca Crackers',
            image: '/assets/images/foodmenu/tunatataki.jpeg',
            profile: {
              madeWith: ['Tuna', 'Avocado', 'Wasabi', 'Squid ink', 'Tapioca'],
              tasteProfile:
                'Seared tuna served rare at the centre, complemented by smooth avocado-wasabi puree, delicate squid ink accents, and crisp tapioca crackers for texture.',
              allergyCaution: ['Fish', 'Seafood'],
              bestExperiencedWith: 'Dry Riesling or light Pinot Noir',
              bestFor: 'Guests who enjoy bold yet clean flavours with a contemporary presentation.',
            },
          },
        ],
      },
      {
        id: 'bel-main',
        title: 'Main Course Selection',
        note: 'Please select one.',
        venue: 'belombre',
        courseKey: 'main',
        choices: [
          {
            optionId: 'bel-main-caramelized-fish',
            title: BEL_OMBRE_OPTIONS.main[0],
            teaser: 'Ridge Gourd Puree · Sauteed Brede · Crab Soup',
            image: '/assets/images/foodmenu/caramelfish.png',
            profile: {
              madeWith: ['Coral grouper (fish)', 'Ridge gourd', 'Local greens', 'Crab broth'],
              tasteProfile:
                'Golden caramelized coral grouper served over smooth ridge gourd puree, with sauteed local greens and a refined crab-infused broth.',
              allergyCaution: ['Fish', 'Shellfish'],
              bestExperiencedWith: 'Sauvignon Blanc or Chardonnay',
              bestFor: 'Guests who prefer delicate seafood with depth and subtle coastal richness.',
            },
          },
          {
            optionId: 'bel-main-lamb-shank',
            title: BEL_OMBRE_OPTIONS.main[1],
            teaser: 'Carrot & Cumin Mousseline · Tomato Confit · Thyme Jus',
            image: '/assets/images/foodmenu/lambshank.png',
            profile: {
              madeWith: ['Lamb shank', 'Carrot', 'Cumin', 'Tomato', 'Thyme'],
              tasteProfile:
                'Slow-braised lamb shank, tender and deeply flavourful, paired with silky carrot-cumin mousseline, sweet tomato confit, and thyme-infused jus.',
              allergyCaution: ['Possible dairy in mousseline'],
              bestExperiencedWith: 'Cabernet Sauvignon or Syrah',
              bestFor: 'Guests who enjoy rich, slow-cooked depth and comforting sophistication.',
            },
          },
          {
            optionId: 'bel-main-chicken-supreme',
            title: BEL_OMBRE_OPTIONS.main[2],
            teaser: 'Baby Vegetables · Polenta · Reduction Sauce',
            image: '/assets/images/foodmenu/chickensupreme.png',
            profile: {
              madeWith: ['Chicken breast', 'Seasonal vegetables', 'Polenta', 'Reduction sauce'],
              tasteProfile:
                'Roasted chicken supreme served with seasonal baby vegetables, creamy polenta, and a refined reduction sauce.',
              allergyCaution: ['Possible dairy in polenta or sauce'],
              bestExperiencedWith: 'Chardonnay or light red wine',
              bestFor: 'Guests who prefer a classic, well-balanced and elegant main.',
            },
          },
        ],
      },
      {
        id: 'bel-dessert',
        title: 'Dessert Selection',
        note: 'Please select one.',
        venue: 'belombre',
        courseKey: 'dessert',
        choices: [
          {
            optionId: 'bel-dessert-chocolate-mousse',
            title: BEL_OMBRE_OPTIONS.dessert[0],
            teaser: 'Soft Chocolate Mousse · Creamy Praline · Black Sesame Ice Cream',
            image: '/assets/images/foodmenu/chocolatemousse.png',
            profile: {
              madeWith: ['Chocolate', 'Praline (nuts)', 'Black sesame', 'Cream'],
              tasteProfile:
                'A refined chocolate composition balancing deep cocoa notes with nutty praline and the subtle warmth of black sesame.',
              allergyCaution: ['Nuts', 'Dairy', 'Sesame'],
              bestExperiencedWith: 'Espresso or dessert wine',
              bestFor: 'Guests who enjoy rich, layered chocolate desserts.',
            },
          },
          {
            optionId: 'bel-dessert-coconut-delicacy',
            title: BEL_OMBRE_OPTIONS.dessert[1],
            teaser: 'Coconut Semi-Freddo · Noix de Coco',
            image: '/assets/images/foodmenu/coconutdelicacy.png',
            profile: {
              madeWith: ['Coconut', 'Cream', 'Sugar'],
              tasteProfile:
                'Light coconut semi-freddo with a smooth, frozen texture and delicate tropical sweetness.',
              allergyCaution: ['Coconut', 'Dairy'],
              bestExperiencedWith: 'Sweet Moscato or coconut water',
              bestFor: 'Guests who prefer light, refreshing desserts with tropical notes.',
            },
          },
          {
            optionId: 'bel-dessert-chateau-snow-egg',
            title: BEL_OMBRE_OPTIONS.dessert[2],
            teaser: 'Le Chateau Snow Egg',
            image: '/assets/images/foodmenu/eggsnow.png',
            profile: {
              madeWith: ['Meringue', 'Custard components', 'Fruit accents'],
              tasteProfile:
                'A refined meringue-based dessert with a soft interior, elegantly composed for a delicate and visually striking finish.',
              allergyCaution: ['Eggs', 'Dairy'],
              bestExperiencedWith: 'Champagne or vanilla tea',
              bestFor: 'Guests who enjoy light, airy desserts with subtle sweetness.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'd6-gala',
    tabTitle: 'Day 6 Dinner',
    heading: 'THE ELEVATION GALA',
    whenWhere: 'Chateau de Labourdonnais · 13 March 2026 · 6:30 PM - 1:00 AM',
    intro: 'An evening of refined dining, curated flavours, and elegant celebration.',
    arrivalExperience: {
      title: 'Snacks on arrival',
      snacks: [
        'Cheese delight',
        'Shrimp cocktail croustade',
        'Lamb kebab skewer with green peppercorn sauce',
        'Palm heart crouton, Comte gratine',
      ],
      bar: 'Distillerie de Labourdonnais Rum Cocktail Bar',
    },
    courses: [
      {
        id: 'gala-starter',
        title: 'Starter Selection',
        note: 'Please select one.',
        venue: 'labourdonnais',
        courseKey: 'starter',
        choices: [
          {
            optionId: 'gala-starter-lobster-raviolo',
            title: LABOURDONNAIS_OPTIONS.starter[0],
            teaser: 'Delicate lobster-filled raviolo in foamed broth.',
            image: '/assets/images/foodmenu/raviolli.png',
            profile: {
              madeWith: ['Lobster', 'Pasta', 'Shellfish broth', 'Parsley oil', 'Baby greens'],
              tasteProfile:
                'Delicate lobster-filled raviolo served in a light, foamed cappuccino-style broth, finished with baby leaves and parsley oil.',
              allergyCaution: ['Shellfish', 'Gluten', 'Dairy'],
              bestExperiencedWith: 'Sauvignon Blanc or Champagne',
              bestFor: 'Guests who enjoy refined seafood with elegant, aromatic depth.',
            },
          },
          {
            optionId: 'gala-starter-palmheart-mango',
            title: LABOURDONNAIS_OPTIONS.starter[1],
            teaser: 'Lemongrass, ginger, baby leaves, lemon caviar.',
            image: '/assets/images/foodmenu/palmhearmango.png',
            profile: {
              madeWith: ['Palm heart', 'Mango', 'Lemongrass', 'Ginger', 'Citrus pearls', 'Baby greens'],
              tasteProfile:
                'Fresh palm heart and ripe mango dressed with lemongrass and ginger, complemented by baby leaves and bursts of lemon caviar for brightness.',
              allergyCaution: ['Citrus (lemon caviar)'],
              bestExperiencedWith: 'Dry Riesling or sparkling water with lime',
              bestFor: 'Guests who prefer a light, refreshing, plant-forward starter.',
            },
          },
        ],
      },
      {
        id: 'gala-main',
        title: 'Main Course Selection',
        note: 'Please select one.',
        venue: 'labourdonnais',
        courseKey: 'main',
        choices: [
          {
            optionId: 'gala-main-chicken-ballotine',
            title: LABOURDONNAIS_OPTIONS.main[0],
            teaser: 'Saffron rice, french beans, honey confit cherry tomatoes.',
            image: '/assets/images/foodmenu/chickenmush.jpeg',
            profile: {
              madeWith: ['Chicken breast', 'Mushrooms', 'Saffron rice', 'Pearl onions', 'French beans', 'Cherry tomatoes', 'Honey'],
              tasteProfile:
                'Free-range chicken breast rolled and filled with sauteed mushrooms, gently roasted for tenderness. Served with fragrant saffron rice, pearl onions, crisp French beans, and cherry tomatoes slowly confit with honey.',
              allergyCaution: ['Mushrooms', 'Honey', 'Possible dairy in sauce'],
              bestExperiencedWith: 'Chardonnay or light Pinot Noir',
              bestFor: 'Guests who prefer a refined, balanced dish that is elegant yet not heavy.',
            },
          },
          {
            optionId: 'gala-main-babonne-sea-bream',
            title: LABOURDONNAIS_OPTIONS.main[1],
            teaser: 'Saffron pistils, parsley rice, braised bok choy.',
            image: '/assets/images/foodmenu/babonne.jpeg',
            profile: {
              madeWith: ['Sea bream (fish)', 'Coconut milk', 'Saffron', 'Parsley rice', 'Bok choy'],
              tasteProfile:
                'Fresh local sea bream gently poached in aromatic coconut milk infused with saffron. Served with parsley rice and tender braised bok choy.',
              allergyCaution: ['Fish', 'Coconut'],
              bestExperiencedWith: 'Sauvignon Blanc or dry Riesling',
              bestFor: 'Guests who enjoy delicate coastal flavours with a silky finish.',
            },
          },
          {
            optionId: 'gala-main-braised-beef-cheek',
            title: LABOURDONNAIS_OPTIONS.main[2],
            teaser: 'Mushroom rice, honey-glazed carrots, red wine jus.',
            image: '/assets/images/foodmenu/shreddedbeef.jpeg',
            profile: {
              madeWith: ['Beef cheek', 'Pearl onions', 'Red wine jus', 'Mushroom rice', 'Honey-glazed carrots'],
              tasteProfile:
                'Beef cheek slow-braised in red wine until exceptionally tender, finished with a rich reduction jus. Served with earthy mushroom rice and honey-glazed carrots.',
              allergyCaution: ['Mushrooms', 'Alcohol reduction (wine)'],
              bestExperiencedWith: 'Cabernet Sauvignon or Syrah',
              bestFor: 'Guests who appreciate deep, slow-cooked richness and indulgent flavours.',
            },
          },
        ],
      },
    ],
    staticNotes: [
      'Dessert Buffet Station',
      'Chocolate fondant verrine with vanilla custard',
      'Coconut macaron',
      'Vanilla pannacotta verrine with lime crumble and exotic fruit compote',
      'Pistachio financier',
      'Chocolate dome with orange zest',
      'Contains: Dairy, gluten, nuts, eggs (varies by item)',
      'Beverages included: Soft drinks, water, beer, wine',
      'At the table: Assorted bread rolls, butter and chilli',
    ],
  },
];
