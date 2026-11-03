import { partnersSchema, type Partners } from "./partner.schema";

/**
 * Partner Data
 */

const rawPartners = [
  {
    name: "Indian Angel Network",
    logo: "/partners/IANfund.png",
    role: "Lead Investor",
    url: "https://www.indianangelnetwork.com/",
    isDark: false,
    categories: ["investor"],
  },
  {
    name: "8X Ventures",
    logo: "/partners/8xventures.jpg",
    role: "Co-Investor",
    url: "https://www.8xventures.com/",
    isDark: false,
    categories: ["investor"],
  },
  {
    name: "ITEL Foundation",
    logo: "/partners/itel.png",
    role: "supporter",
    url: "https://itelfoundation.in/",
    isDark: false,
    categories: ["supporter"],
  },
  {
    name: "FITT, IIT Delhi",
    logo: "/partners/FITT.jpg",
    role: "Incubation Support",
    url: "https://fitt-iitd.in/",
    isDark: false,
    categories: ["supporter"],
  },
  {
    name: "Boeing",
    logo: "/partners/boeing.jpg",
    role: "Industry Partner",
    url: "https://www.boeing.com/",
    categories: ["supporter"],
  },
  {
    name: "IN-SPACe",
    logo: "/partners/inspace.jpg",
    role: "Industry Partner",
    url: "https://www.inspace.gov.in/inspace/",
    categories: ["supporter"],
  },
  {
    name: 'ASACO',
    logo: '/partners/asaco.jpg',
    role: 'Industry Partner',
    url: 'https://www.asaco.in/',
    categories: ['partner'],
  },
  {
    name: "HDFC Bank",
    logo: "/partners/hdfc.jpg",
    role: "Industry Partner",
    url: "https://www.hdfcbank.com/",
    categories: ["supporter"],
  },
  {
    name: "Think Gas",
    logo: "/partners/thinkgas.jpg",
    role: "Industry Partner",
    url: "https://www.think-gas.com/",
    categories: ["supporter"],
  },
  {
    name: "Oil India",
    logo: "/partners/oil-india.jpg",
    role: "Industry Partner",
    url: "https://www.oil-india.com/",
    categories: ["supporter"],
  },
  {
    name: "Dynamic Aerospace",
    logo: "/partners/dynamicaerospace.png",
    role: "Industry Partner",
    url: "https://dynamicaerospace.co.in/",
    categories: ["partner"],
  },
] as const;

export const partners: Partners = partnersSchema.parse(rawPartners);
