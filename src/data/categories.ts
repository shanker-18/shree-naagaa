import { Package, Heart, Crown, Gift, Coffee } from 'lucide-react';

export interface Category {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  items: string[];
}

export const categories: Category[] = [
  {
    title: 'Mix',
    description: 'Ready-to-cook mixes for quick authentic meals',
    icon: Package,
    gradient: 'from-amber-600 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    items: [
      'Puliodharai mix: A chemical-free mix used to prepare tamarind rice. 100 grams are sufficient for a quarter-measure of rice.',
      'Vathakkuzhambu mix: Contains sundakkai vathal, manathakkali vathal, and garlic. Mixing 2 tablespoons with Gingelly oil and rice makes a tasty dish.'
    ]
  },
  {
    title: 'Pickle',
    description: 'Homemade pickles with medicinal benefits and rich taste',
    icon: Heart,
    gradient: 'from-purple-600 to-indigo-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    items: [
      'Poondu pickle: Has medicinal value for an ailing heart and removes gastritis.',
      'Pirandai pickle: Good for digestion and helps with joint pain.',
      'Jathikkai pickle: Aids the digestive function and has aromatic properties.',
      'Mudakkathan pickle: Good for joint pain and has anti-inflammatory properties.',
      'Kara narthangai pickle: Very tasty and improves digestive system function.'
    ]
  },
  {
    title: 'Powder',
    description: 'Traditional cooking powders made fresh without additives',
    icon: Crown,
    gradient: 'from-red-600 to-rose-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    items: [
      'Turmeric powder: Prepared from cleaned and dried virali turmeric tubes, ground finely without additives. Used for cooking and as a cosmetic facial application.',
      'Sambar powder: Essential spice blend for preparing authentic South Indian sambar with perfect aroma and taste.',
      'Rasam powder: Prepared with tomato in dhal stew. Used in rasam to make it aromatic and tasty.',
      'Ellu idli powder: Prepared with Gingelly oil and garlic. Eaten as a side dish with Idly or Dosa.',
      'Poondu idly powder: Special garlic-infused idly powder with medicinal properties and rich taste.',
      'Andra spl paruppu powder: Special Andhra-style lentil powder blend for traditional recipes.',
      'Moringa leaf powder: Nutrient-rich powder made from dried moringa leaves, packed with vitamins and minerals.',
      'Curry leaves powder: Aromatic powder made from fresh curry leaves, adds authentic South Indian flavor.',
      'Red Chilli powder: Made from a fine variety of chili. Used for making pickles and savory preparations.'
    ]
  },
  {
    title: 'Appalam',
    description: 'Crispy appalams made from quality ingredients',
    icon: Gift,
    gradient: 'from-emerald-600 to-green-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    items: [
      'Ulundhu appalam: Prepared from quality blackgram powder. It\'s very tasty and healthy. Fried and eaten as a side dish for Puttu, Sambar Rice, Rasam Rice.',
      'Rice appalam: Fried in cooking oil. Eaten as a side dish for Sambar Rice, Rasam Rice, Puli Kuzhambu rice, Vathal rice, and puliyotharai rice.',
      'Kizhangu appalam: Made from Tapioca powder mixed with masala and dried on a flatbed. Can be eaten as is or with rice.'
    ]
  },
  {
    title: 'Coffee',
    description: 'Premium coffee powder for perfect brew',
    icon: Coffee,
    gradient: 'from-yellow-600 to-amber-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    items: [
      'Coffee powder: Premium quality coffee powder made from carefully selected coffee beans, roasted and ground to perfection for that authentic South Indian filter coffee experience.'
    ]
  }
];
