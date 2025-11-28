export interface HeroData {
  title: string;
  subtitle: string;
  ending: string;
  subtext: string;
}

export interface StatItem {
  num: string;
  label: string;
}

export interface AboutItem {
  title: string;
  desc: string;
}

export interface TestimonialItem {
  name: string;
  text: string;
}

export interface ContactData {
  email: string;
  phone: string;
  credit: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
}

export interface FounderData {
  name: string;
  role: string;
}

export interface AiPuliSectionData {
  leadIn: string;
  title: string;
  description1: string;
  description2: string;
  cta: string;
  link: string;
}

export interface ContentData {
  brand: string;
  hero: HeroData;
  stats: StatItem[];
  services: ServiceItem[];
  about: AboutItem[];
  testimonials: TestimonialItem[];
  contact: ContactData;
  founder: FounderData;
  aiPuli: AiPuliSectionData;
}