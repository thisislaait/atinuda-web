export const BEL_OMBRE_OPTIONS = {
  starter: ['Prawns Ravioli', 'Smoked Marlin', 'Tuna Tataki'],
  main: ['Caramelized Coral Grouper', 'Braised Lamb Shank', 'Chicken Supreme'],
  dessert: ['Chocolate Mousse Praline', 'Coconut Delicacy', 'Chateau Snow Egg'],
} as const;

export const LABOURDONNAIS_OPTIONS = {
  starter: ['Lobster Raviolo in Cappuccino Broth', 'Palm Heart & Mango Salad'],
  main: [
    'Chicken Ballotine with Mushrooms',
    'Babonne (Local Sea Bream) in Coconut Milk',
    'Slow-Braised Beef Cheek',
  ],
} as const;

export type ProfilePreview = {
  uid?: string | null;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  company?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
  shortBio?: string;
  longBio?: string;
  photoURL?: string;
};
