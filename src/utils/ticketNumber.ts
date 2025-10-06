// export const generateTicketNumber = (ticketType: string): string => {
//   const randomCode = 100 + Math.floor(Math.random() * 90000);
//   const type = ticketType.toLowerCase();
//   let prefix = 'ATIN';

//   if (type.includes('conference')) prefix = 'CONF-ATIN';
//   else if (type.includes('workshop')) prefix = 'WRK-ATIN';
//   else if (type.includes('executive')) prefix = 'EXEC-ATIN';
//   else if (type.includes('premium')) prefix = 'PREM-ATIN';
//   else if (type.includes('signature')) prefix = 'SIG-ATIN';
//   else if (type.includes('partner')) prefix = 'PAT-ATIN';
//   else if (type.includes('all')) prefix = 'ALL-ACCESS';
//   else if (type.includes('dinner')) prefix = 'DINE-ATIN';

//   return `${prefix}${randomCode}`;
// };


// Pass txRef when you create the ticket (server side recommended)
export const generateTicketNumber = (ticketType: string, txRef: string): string => {
  const type = (ticketType || '').toLowerCase();
  let prefix = 'ATIN';

  if (type.includes('conference')) prefix = 'CONF-ATIN';
  else if (type.includes('workshop')) prefix = 'WRK-ATIN';
  else if (type.includes('executive')) prefix = 'EXEC-ATIN';
  else if (type.includes('premium'))   prefix = 'PREM-ATIN';
  else if (type.includes('signature')) prefix = 'SIG-ATIN';
  else if (type.includes('partner'))   prefix = 'PAT-ATIN';
  else if (type.includes('all'))       prefix = 'ALL-ACCESS';
  else if (type.includes('dinner'))    prefix = 'DINE-ATIN';

  // Take a short, safe suffix from txRef (last 6 chars, alphanumeric only)
  const suffix = (txRef || '')
    .slice(-6)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '0')
    .padStart(6, '0');

  return `${prefix}-${suffix}`;
};
