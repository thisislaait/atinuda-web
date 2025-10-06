// src/lib/azizi.ts
// Typed sample dataset for the Azizi attendance list.

export type AziziMeta = {
  id: string;
  path: string;
  createTime?: string;
  updateTime?: string;
};

export type AziziRecord = {
  rsvp?: string;
  ticketNumber?: string;
  mobile?: string;
  name?: string | null;
  company?: string | null;
  respondedAt?: string;
  eventName?: string;
  eventDate?: string;
  eventVenue?: string;
  __meta?: AziziMeta;
};

const aziziData: Record<string, AziziRecord> = {
  "1RZHFf1IZEyu0jVAZdBe": {
    rsvp: "maybe",
    ticketNumber: "567889",
    mobile: "08177041935",
    name: null,
    company: null,
    respondedAt: "2025-09-25T17:25:33.336Z",
    __meta: {
      id: "1RZHFf1IZEyu0jVAZdBe",
      path: "Azizi/1RZHFf1IZEyu0jVAZdBe",
      createTime: "2025-09-25T17:25:33.361Z",
      updateTime: "2025-09-25T17:25:33.361Z",
    },
  },
  "2cFz6z4Eq2VzfmDayu9y": {
    rsvp: "yes",
    ticketNumber: "2525",
    mobile: "+2348033231494",
    name: null,
    company: null,
    respondedAt: "2025-10-05T22:39:06.172Z",
    __meta: {
      id: "2cFz6z4Eq2VzfmDayu9y",
      path: "Azizi/2cFz6z4Eq2VzfmDayu9y",
      createTime: "2025-10-05T22:39:06.192Z",
      updateTime: "2025-10-05T22:39:06.192Z",
    },
  },
  "3Gk316IEM9mmIkQC8JA7": {
    rsvp: "yes",
    ticketNumber: "PREM-ATIN83511",
    mobile: "+2348063350344",
    name: "IKECHUKWU",
    company: null,
    respondedAt: "2025-10-03T09:15:51.958Z",
    __meta: {
      id: "3Gk316IEM9mmIkQC8JA7",
      path: "Azizi/3Gk316IEM9mmIkQC8JA7",
      createTime: "2025-10-03T09:15:51.990Z",
      updateTime: "2025-10-03T09:15:51.990Z",
    },
  },
  /* ... rest of your entries unchanged ... */
  "zUg9MdbXTly2KIexBnny": {
    rsvp: "yes",
    ticketNumber: "EXEC-ATIN13400",
    mobile: "+2348188691001",
    name: "Chinwe",
    company: null,
    respondedAt: "2025-09-30T15:53:03.121Z",
    __meta: {
      id: "zUg9MdbXTly2KIexBnny",
      path: "Azizi/zUg9MdbXTly2KIexBnny",
      createTime: "2025-09-30T15:53:03.158Z",
      updateTime: "2025-09-30T15:53:03.158Z",
    },
  },
};

export default aziziData;
