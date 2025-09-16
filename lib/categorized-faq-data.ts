export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  count: number;
  color: string;
  gradientColor: string;
  iconColor: string;
  faqs: FaqItem[];
}

// Blood Donation FAQs
export const bloodFaqs: FaqItem[] = [
  {
    id: "blood-1",
    question: "Why should I donate blood?",
    answer: "Blood donation is a critical and selfless act that directly saves lives. When you donate blood, you're helping accident victims, surgery patients, cancer patients, and many others who depend on blood transfusions. A single donation can save up to three lives, making it one of the most impactful ways to help others.",
  },
  {
    id: "blood-2",
    question: "Who is eligible to donate blood?",
    answer: "Generally, individuals aged 17 and older, weighing at least 110 pounds, and in good health are eligible. Basic eligibility includes: At least 17 years old (16 with parental consent in some states), weigh at least 110 pounds, be in good general health, and feel well on donation day.",
  },
  {
    id: "blood-3",
    question: "How often can I donate blood?",
    answer: "Whole blood donations can typically be made every 56 days. Donation frequency depends on the type of donation: Whole Blood every 8 weeks (56 days), Double Red Cells every 16 weeks (112 days), and Platelets every 7 days (up to 24 times per year).",
  },
  {
    id: "blood-4",
    question: "What should I do to prepare for blood donation?",
    answer: "Stay hydrated, eat a healthy meal before donating, and bring a valid ID. Eat a healthy meal, drink plenty of water, get a good night's sleep, and avoid alcohol for 24 hours before donation. Bring your ID and wear comfortable clothing with sleeves that can be rolled up.",
  },
  {
    id: "blood-5",
    question: "Are there any risks associated with donating blood?",
    answer: "Blood donation is safe. Some may experience minor side effects like dizziness or bruising. Most people experience no side effects. Some may have slight fatigue, mild thirst, or temporary lightheadedness. Rare side effects include bruising at the needle site, fainting, or nausea.",
  },
  {
    id: "blood-6",
    question: "How can I find a blood donation center near me?",
    answer: "Visit the American Red Cross website or contact local hospitals and blood banks. You can also use our location finder on our website to find the nearest donation center to you.",
  },
  {
    id: "blood-7",
    question: "How long does a blood donation take?",
    answer: "The entire process takes about an hour: Registration & Health Check (15-20 min), Actual Donation (8-10 min), and Rest & Refreshments (15 min).",
  },
  {
    id: "blood-8",
    question: "What happens to my blood after donation?",
    answer: "Your donated blood is tested, processed, and separated into components (red cells, plasma, platelets) that can help multiple patients. It's then distributed to hospitals and medical centers where it's needed most.",
  },
  {
    id: "blood-9",
    question: "Can I donate if I have tattoos or piercings?",
    answer: "Yes, you can donate blood if you have tattoos or piercings, provided they were done at a licensed facility using sterile equipment. There's typically a 3-month waiting period after getting a new tattoo or piercing from an unlicensed facility.",
  },
  {
    id: "blood-10",
    question: "What should I eat before donating blood?",
    answer: "Eat iron-rich foods like spinach, red meat, beans, and fortified cereals. Avoid fatty foods and alcohol. Stay well-hydrated by drinking plenty of water. A light, healthy meal 2-3 hours before donation is ideal.",
  },
  {
    id: "blood-11",
    question: "Can I exercise after donating blood?",
    answer: "Avoid strenuous exercise for 24 hours after donation. Light activities like walking are fine. Your body needs time to replenish the donated blood volume, so heavy lifting or intense workouts should be postponed.",
  },
  {
    id: "blood-12",
    question: "What blood types are most needed?",
    answer: "O-negative blood is always in high demand as it's the universal donor type. Type O-positive is also frequently needed. However, all blood types are important, and we need regular donations from all types to maintain adequate supplies.",
  },
];

// Organ Donation FAQs
export const organFaqs: FaqItem[] = [
  {
    id: "organ-1",
    question: "How do I become an organ donor?",
    answer: "Register through your state's donor registry, typically available online or at the DMV. You can also indicate your wish to donate on your driver's license or state ID card.",
  },
  {
    id: "organ-2",
    question: "Can I specify which organs I want to donate?",
    answer: "Yes, you can specify which organs and tissues you wish to donate. When you register, you'll have the option to choose which organs and tissues you're comfortable donating.",
  },
  {
    id: "organ-3",
    question: "Does my age or medical history affect my ability to donate organs?",
    answer: "Most people can donate, regardless of age or medical history. Medical professionals will assess suitability at the time of donation. There's no upper age limit for organ donation as long as you're healthy and meet all other eligibility requirements.",
  },
  {
    id: "organ-4",
    question: "Will organ donation affect funeral arrangements?",
    answer: "Organ donation does not interfere with traditional funeral arrangements, including open-casket services. The donation process is conducted with the utmost respect and care.",
  },
  {
    id: "organ-5",
    question: "Is there a cost to my family for organ donation?",
    answer: "No, all costs related to organ donation are covered by the transplant organization. Your family will not incur any expenses related to the donation process.",
  },
  {
    id: "organ-6",
    question: "Can I change my mind about organ donation?",
    answer: "Yes, you can change your organ donation status at any time by updating your registration with your state's donor registry or by updating your driver's license information.",
  },
  {
    id: "organ-7",
    question: "What organs and tissues can be donated?",
    answer: "Organs that can be donated include heart, lungs, liver, kidneys, pancreas, and intestines. Tissues include corneas, skin, bone, tendons, and heart valves.",
  },
  {
    id: "organ-8",
    question: "How many lives can one organ donor save?",
    answer: "One organ donor can save up to 8 lives through organ donation and enhance the lives of up to 75 people through tissue donation.",
  },
  {
    id: "organ-9",
    question: "Can living people donate organs?",
    answer: "Yes, living donors can donate a kidney, part of their liver, part of their lung, part of their intestine, or part of their pancreas. Living donation is a generous gift that can save lives while the donor continues to live a healthy life.",
  },
  {
    id: "organ-10",
    question: "What is the organ donation process after death?",
    answer: "When a registered donor dies, medical professionals evaluate organ viability. If suitable, organs are surgically removed and preserved for transportation to recipients. The process is conducted with utmost respect and doesn't delay funeral arrangements.",
  },
  {
    id: "organ-11",
    question: "Are there religious objections to organ donation?",
    answer: "Most major religions support organ donation as an act of charity and compassion. However, individual beliefs may vary. It's important to discuss your decision with your family and religious leaders if you have concerns.",
  },
  {
    id: "organ-12",
    question: "How are organ recipients chosen?",
    answer: "Recipients are chosen based on medical compatibility, severity of illness, time on waiting list, and geographic location. The process is managed by organ procurement organizations to ensure fair and medical-based allocation.",
  },
];

// Fundraising/Zeffy FAQs
export const fundraisingFaqs: FaqItem[] = [
  {
    id: "fundraising-1",
    question: "What is Zeffy?",
    answer: "Zeffy is a 100% free fundraising platform for nonprofits, covering all transaction fees through voluntary contributions from donors. It's designed to help organizations raise funds without any platform fees.",
  },
  {
    id: "fundraising-2",
    question: "How does Zeffy remain free for nonprofits?",
    answer: "Zeffy relies entirely on optional contributions from donors to cover operational costs, ensuring nonprofits receive 100% of the funds raised. Donors can choose to add a small contribution to support Zeffy's free services.",
  },
  {
    id: "fundraising-3",
    question: "What fundraising tools does Zeffy offer?",
    answer: "Zeffy provides tools for donations, event ticketing, peer-to-peer campaigns, memberships, online shops, raffles, auctions, and donor management. It's a comprehensive platform for all your fundraising needs.",
  },
  {
    id: "fundraising-4",
    question: "How can I communicate Zeffy's model to my donors?",
    answer: "Inform donors that Zeffy allows 100% of their donation to support your mission, with optional contributions supporting Zeffy's free services. This transparency helps donors understand exactly where their money goes.",
  },
  {
    id: "fundraising-5",
    question: "Where can I find more information or assistance with Zeffy?",
    answer: "Visit Zeffy's Help Center for comprehensive guides and support. They offer detailed documentation, tutorials, and customer support to help you get started with fundraising.",
  },
  {
    id: "fundraising-6",
    question: "Can I track my fundraising progress on Zeffy?",
    answer: "Yes, Zeffy provides comprehensive donor management and tracking tools. You can monitor your fundraising progress, donor engagement, and campaign performance in real-time.",
  },
  {
    id: "fundraising-7",
    question: "Is there a minimum amount I need to raise to use Zeffy?",
    answer: "No, there's no minimum fundraising amount required to use Zeffy. Whether you're raising $100 or $100,000, the platform is free to use for all nonprofits.",
  },
  {
    id: "fundraising-8",
    question: "How quickly can I start fundraising with Zeffy?",
    answer: "You can start fundraising immediately after signing up. The platform is designed for quick setup, allowing you to create campaigns and start accepting donations right away.",
  },
  {
    id: "fundraising-9",
    question: "Does Zeffy support recurring donations?",
    answer: "Yes, Zeffy supports recurring donations, allowing donors to set up monthly, quarterly, or annual donations. This feature helps nonprofits build sustainable funding streams and improve donor retention.",
  },
  {
    id: "fundraising-10",
    question: "Can I customize my Zeffy donation pages?",
    answer: "Absolutely! Zeffy allows you to customize donation pages with your organization's branding, colors, logos, and messaging. You can create multiple campaigns with different designs to match your specific fundraising goals.",
  },
  {
    id: "fundraising-11",
    question: "What payment methods does Zeffy accept?",
    answer: "Zeffy accepts all major credit cards, debit cards, and bank transfers. The platform also supports digital wallets like Apple Pay and Google Pay, making it convenient for donors to contribute using their preferred payment method.",
  },
  {
    id: "fundraising-12",
    question: "How does Zeffy help with donor management?",
    answer: "Zeffy provides comprehensive donor management tools including donor profiles, giving history, automated thank-you emails, tax receipts, and detailed analytics. You can segment donors and create targeted communication campaigns.",
  },
];

// Combined FAQ data with category information
export const categorizedFaqData: Record<string, FaqCategory> = {
  blood: {
    id: "blood",
    title: "Blood Donation",
    count: bloodFaqs.length,
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    gradientColor: "from-red-500 to-red-600",
    iconColor: "text-red-600 dark:text-red-400",
    faqs: bloodFaqs,
  },
  organ: {
    id: "organ",
    title: "Organ Donation",
    count: organFaqs.length,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    gradientColor: "from-blue-500 to-blue-600",
    iconColor: "text-blue-600 dark:text-blue-400",
    faqs: organFaqs,
  },
  fundraising: {
    id: "fundraising",
    title: "Fundraising",
    count: fundraisingFaqs.length,
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    gradientColor: "from-green-500 to-green-600",
    iconColor: "text-green-600 dark:text-green-400",
    faqs: fundraisingFaqs,
  },
};
