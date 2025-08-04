// utils/constants.ts

export const ticketLocations: Record<string, string | string[]> = {
  'Conference Access': 'Lagos Continental Hotel',
  'Workshop Access': 'Lagos Continental Hotel',
  'Premium Experience': 'Lagos Continental Hotel',
  'Executive Access': ['Lagos Continental Hotel', 'GRAS Lagos'],
  'Dinner Only': 'GRAS Lagos',
};

export const getLocationText = (ticketType: string): string => {
  const location = ticketLocations[ticketType];
  if (!location) return 'TBD';
  return Array.isArray(location) ? location.join(' & ') : location;
};
