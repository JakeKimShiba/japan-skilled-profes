export interface GuideSection {
  title: string;
  content: string; // HTML string
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  faq: GuideFAQ[];
}
