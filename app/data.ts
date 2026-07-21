export type Story = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  featured?: boolean;
};

export const stories: Story[] = [
  {
    slug: "the-letter-in-the-blue-tin",
    category: "Family & Legacy",
    title: "At 67, Margaret Found a Letter Her Mother Had Hidden for Forty Years",
    excerpt: "A quiet Sunday, an old blue tin, and one sentence that changed everything she believed about her family.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=1600&q=85",
    readTime: "12 min read",
    date: "July 21, 2026",
    featured: true,
  },
  {
    slug: "the-empty-chair-at-thanksgiving",
    category: "Second Chances",
    title: "The Empty Chair at Thanksgiving Wasn't Empty After All",
    excerpt: "For fifteen years, Frank refused to say his brother's name. Then the doorbell rang.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85",
    readTime: "9 min read",
    date: "July 20, 2026",
  },
  {
    slug: "the-woman-on-platform-nine",
    category: "Life Stories",
    title: "Every Tuesday, She Waited on Platform Nine With Two Cups of Coffee",
    excerpt: "The stationmaster thought he knew why. The truth was even more beautiful.",
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",
    readTime: "8 min read",
    date: "July 19, 2026",
  },
  {
    slug: "a-key-to-the-house-on-maple-street",
    category: "Justice & Truth",
    title: "Her Children Sold the Family Home. They Forgot She Still Had One Key",
    excerpt: "Eleanor did not argue. She simply waited until Monday morning and called the one person who knew the truth.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    readTime: "14 min read",
    date: "July 18, 2026",
  },
  {
    slug: "the-dance-they-never-had",
    category: "Love After 50",
    title: "They Missed Their High School Dance. Fifty Years Later, the Music Began",
    excerpt: "A promise made in 1974 finally found its way home.",
    image: "https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1200&q=85",
    readTime: "7 min read",
    date: "July 17, 2026",
  },
  {
    slug: "the-recipe-in-the-margin",
    category: "Grandparents",
    title: "Grandma's Recipe Had One Ingredient No One Could Buy",
    excerpt: "Three generations gathered in the kitchen to make the pie—and finally understood her note in the margin.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85",
    readTime: "6 min read",
    date: "July 16, 2026",
  },
];

export const chapters = [
  {
    title: "The Sunday Box",
    paragraphs: [
      "Margaret Ellis had not opened the blue tin since the winter her mother passed away. It sat on the highest shelf of the hall closet, behind a stack of Christmas tablecloths and a cedar box filled with buttons nobody had used in years.",
      "On a quiet Sunday morning, with rain tracing silver lines down the kitchen window, Margaret decided it was time. At sixty-seven, she had learned that time did not heal every wound. Sometimes it simply taught you how to carry one without dropping the groceries.",
      "The tin was lighter than she remembered. Inside were three photographs, a dried sprig of lavender, and an envelope with her name written in the careful, slanted handwriting she would have recognized anywhere.",
      "The postmark was dated October 12, 1984. The letter had never been mailed.",
    ],
  },
  {
    title: "What Her Mother Knew",
    paragraphs: [
      "Margaret sat at the same oak table where her mother had once rolled biscuit dough on Saturday mornings. For several minutes, she only held the envelope. Then she slipped one finger beneath the flap.",
      "My dear Maggie, the letter began. If you are reading this, then I waited too long to tell you something you always deserved to know.",
      "The words that followed did not erase Margaret's childhood. They rearranged it. Her father had not abandoned them, as she had always believed. He had written every month for nine years. Her mother, frightened that he would take Margaret away, had hidden every letter.",
      "There was no excuse in the pages, only an apology—and an address in a town three hours north.",
    ],
  },
  {
    title: "The Drive North",
    paragraphs: [
      "By noon, the rain had stopped. Margaret called her daughter, packed a thermos of coffee, and placed the blue tin on the passenger seat. She told herself she was only going to see the house. She did not have to knock.",
      "The road carried her past the farms and church steeples of her childhood. With every mile, anger rose and softened, rose and softened, until it felt less like a storm and more like a tide.",
      "At four seventeen, she turned onto Hawthorne Lane. The house at number eighteen was small and yellow, with a ramp leading to the porch and wind chimes turning in the afternoon breeze.",
      "An elderly man was watering a row of red geraniums. When Margaret stepped from the car, he looked up. The watering can slipped from his hand before she said a word.",
    ],
  },
  {
    title: "The Second Photograph",
    paragraphs: [
      "His name was Samuel. He had kept a photograph of Margaret on the mantel for forty-two years—the same school portrait her mother had hidden in the blue tin.",
      "They did not try to recover a lifetime in one afternoon. They shared coffee. They compared memories. They sat through long silences that no longer felt empty.",
      "Before Margaret left, Samuel gave her a wooden box filled with letters, birthday cards, and photographs of the family she had never met. On top was a card he had written for her sixty-seventh birthday, though he had no reason to believe she would ever read it.",
      "You are never too old for the truth, it said. And you are never too late to come home.",
    ],
  },
];
