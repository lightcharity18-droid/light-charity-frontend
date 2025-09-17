export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    id: 1,
    question: "What is Light Charity Foundation and how does it work?",
    answer: "Light Charity Foundation is a comprehensive platform that connects blood donors with recipients, hospitals, and blood banks. We facilitate life-saving blood donations, organ donations, and provide emergency medical support through our integrated network of healthcare partners and volunteers.",
  },
  {
    id: 2,
    question: "How do I register as a blood donor?",
    answer: "Simply create an account on our platform, complete your medical profile, and verify your eligibility. Once registered, you'll receive notifications about nearby donation opportunities and emergency requests that match your blood type and location.",
  },
  {
    id: 3,
    question: "Is my personal and medical data secure?",
    answer: "Absolutely. We use industry-standard encryption and follow strict HIPAA compliance protocols. Your data is securely stored and only shared with verified healthcare providers when necessary for life-saving purposes. You maintain full control over your privacy settings.",
  },
  {
    id: 4,
    question: "Are there any costs involved in donating or receiving blood?",
    answer: "Blood donation through Light Charity Foundation is completely free for donors. For recipients, we work with insurance providers and offer financial assistance programs. Our goal is to ensure that cost never becomes a barrier to accessing life-saving blood when needed.",
  },
  {
    id: 5,
    question: "How quickly can I find a blood donor in an emergency?",
    answer: "Our emergency response system can connect you with compatible donors within minutes. We maintain a real-time database of available donors and use location-based matching to find the nearest compatible donors. Critical cases are prioritized and can often be resolved within 30-60 minutes.",
  },
  {
    id: 6,
    question: "What other services does Light Charity Foundation provide?",
    answer: "Beyond blood donation, we facilitate organ donation registration, provide disaster relief coordination, support community health initiatives, and offer educational resources about health and wellness. We also run volunteer programs and partner with local organizations for comprehensive community support.",
  },
  {
    id: 7,
    question: "How can I volunteer with Light Charity Foundation?",
    answer: "We offer various volunteer opportunities including event coordination, donor outreach, community education, and emergency response support. Visit our volunteer section to explore available positions and apply. We provide training and support for all our volunteers.",
  },
  {
    id: 8,
    question: "Can I track my donation history and impact?",
    answer: "Yes! Your donor dashboard provides a complete history of your donations, including dates, locations, and the number of lives potentially saved. You can also see community impact statistics and receive updates about how your contributions have helped others.",
  },
];
