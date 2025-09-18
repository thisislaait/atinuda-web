export const generateTicketNumber = (ticketType: string): string => {
  const randomCode = 100 + Math.floor(Math.random() * 90000);
  const type = ticketType.toLowerCase();
  let prefix = 'ATIN';

  if (type.includes('conference')) prefix = 'CONF-ATIN';
  else if (type.includes('workshop')) prefix = 'WRK-ATIN';
  else if (type.includes('executive')) prefix = 'EXEC-ATIN';
  else if (type.includes('premium')) prefix = 'PREM-ATIN';
  else if (type.includes('signature')) prefix = 'SIG-ATIN';
  else if (type.includes('dinner')) prefix = 'DINE-ATIN';

  return `${prefix}${randomCode}`;
};
