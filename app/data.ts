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

export type Chapter = {
  title: string;
  paragraphs: string[];
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

const blueTinChapters: Chapter[] = [
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

export const chaptersBySlug: Record<string, Chapter[]> = {
  "the-letter-in-the-blue-tin": blueTinChapters,
  "the-empty-chair-at-thanksgiving": [
    { title: "The Place No One Took", paragraphs: [
      "Frank Mercer set the Thanksgiving table for eleven and placed only ten chairs. The missing chair had belonged to his younger brother, Daniel, before one bitter argument divided the family fifteen years earlier.",
      "No one mentioned the gap beside the window. Frank's daughter tucked the tablecloth beneath a serving dish, his grandchildren chased each other through the hallway, and every adult quietly agreed to leave the past alone.",
      "Then, just as Frank lifted the carving knife, the doorbell rang. On the porch stood a teenage boy holding a foil-covered pie and a photograph Frank had not seen since 1998.",
    ]},
    { title: "Daniel's Son", paragraphs: [
      "The boy introduced himself as Noah. Daniel had died in the spring, he said, and among his belongings was a box of letters addressed to Frank but never sent.",
      "Frank read the first letter in the hallway. Daniel had written that pride was a poor substitute for a brother, and that every Thanksgiving he set an empty chair at his own table too.",
      "Noah had driven six hours because his father left him one final request: bring Grandma Mercer's apple pie recipe home and ask whether there might still be room at the table.",
    ]},
    { title: "One More Chair", paragraphs: [
      "Frank returned to the dining room without explaining. He went to the basement, carried up the old oak chair, and placed it beside his own.",
      "Over dinner, Noah told stories that made Daniel feel near again: his terrible singing, his habit of rescuing stray dogs, and the way he always burned the first pie crust. Grief and laughter took turns around the table.",
      "Before dessert, Frank gave Noah the carving knife. The chair had not been empty after all. It had been holding a place for forgiveness until someone was brave enough to sit down.",
    ]},
  ],
  "the-woman-on-platform-nine": [
    { title: "Two Coffees at 8:10", paragraphs: [
      "Every Tuesday, Evelyn Hart arrived at Bellweather Station at eight ten carrying two paper cups. She sat on the same bench on platform nine and watched the northbound train arrive without ever boarding it.",
      "Thomas, the stationmaster, assumed she was waiting for a husband who had died or a son who had moved away. In twenty-seven years on the railway, he had learned not to disturb a person's private ritual.",
      "One cold morning, a delay kept the platform empty. Thomas finally asked whether the second coffee was for someone. Evelyn smiled and said it was for a stranger she had met only once.",
    ]},
    { title: "The Winter of 1963", paragraphs: [
      "At nineteen, Evelyn had stood on that platform with a newborn baby and no money for a ticket. A woman in a red coat bought her breakfast, found her a safe place to stay, and helped her call an aunt in Vermont.",
      "They drank coffee while they waited. The woman refused repayment and asked Evelyn to do the same kindness for someone else when she could.",
      "Evelyn never learned her name. But for sixty-three years, she remembered the warmth of the cup and the simple fact that one stranger had treated her future as something worth saving.",
    ]},
    { title: "The Cup She Passed On", paragraphs: [
      "The second coffee was not for the woman in the red coat. It was for whoever looked as lost as Evelyn once had. Some Tuesdays no one needed it; on others, a missed train opened the door to a conversation.",
      "That morning, a young nurse sat down after receiving bad news from home. Evelyn offered her the untouched cup and listened until the next train came.",
      "After they left, Thomas placed a small sign beside the bench: Coffee paid forward. Take one if you need it. Leave one when you can. By Friday, the ledge held seven cups.",
    ]},
  ],
  "a-key-to-the-house-on-maple-street": [
    { title: "The Sold Sign", paragraphs: [
      "Eleanor Price learned that her children had sold the Maple Street house when a SOLD sign appeared beside the hydrangeas. They believed the deed had passed to them after their father's death.",
      "She did not argue on the front lawn. She packed an overnight bag, slipped the old brass key into her pocket, and called Miriam Cole, the attorney who had witnessed the couple's estate plan.",
      "By Monday morning, the buyers were measuring the kitchen while Eleanor sat across from her children in a quiet conference room downtown.",
    ]},
    { title: "What the Deed Said", paragraphs: [
      "Miriam placed a certified deed on the table. Eleanor's husband had left his share to the children, but Eleanor already owned the other half and held a recorded life estate in the entire property.",
      "The sale contract had been signed without her consent. The title company had relied on an incomplete family affidavit, and the closing could not lawfully stand.",
      "Eleanor's children began blaming one another. She stopped them. The house mattered, she said, but what hurt most was discovering that they had planned her future without asking her to be part of it.",
    ]},
    { title: "A Different Agreement", paragraphs: [
      "The buyers received their deposit back. Eleanor could have kept the house exactly as it was, yet she knew the stairs and winter repairs were becoming too much.",
      "She chose a smaller home nearby and sold Maple Street properly. Part of the money funded her care; another part created education accounts for the grandchildren, with Miriam serving as trustee.",
      "On moving day, Eleanor handed each child a copy of the new plan. She kept the brass key. It no longer opened her front door, but it reminded everyone that love did not cancel a person's right to choose.",
    ]},
  ],
  "the-dance-they-never-had": [
    { title: "A Promise in 1974", paragraphs: [
      "June Parker and Walter Bell planned to attend the spring dance together in 1974. The morning of the event, Walter's father suffered a heart attack, and Walter left school to help support his family.",
      "They promised to dance when life settled down. Instead, June moved west for college, letters became Christmas cards, and both built good lives with other people.",
      "Fifty years later, widowed and back in their hometown, they met again at a library fundraiser. Walter's first question was whether she still remembered the promise.",
    ]},
    { title: "The Gymnasium Lights", paragraphs: [
      "Their former classmates secretly borrowed the old school gym. They hung paper stars from the basketball hoops and found a record player like the one the school had used.",
      "June arrived expecting a committee meeting. Walter waited at center court in a navy suit, holding a corsage made from gardenias because she had once written that roses were too predictable.",
      "When their song began, neither moved with the confidence of seventeen. Walter counted the steps under his breath, and June laughed until she had to wipe her eyes.",
    ]},
    { title: "Right on Time", paragraphs: [
      "They danced for one song and then another. Around them, old friends swayed, applauded, and remembered versions of themselves they thought had disappeared.",
      "Walter apologized for being fifty years late. June told him they had each kept the promise by living fully enough to return to it.",
      "At nine o'clock, the custodian dimmed the lights. They walked home slowly, not trying to recover the years between them, only grateful that some beautiful things arrive late and still arrive right on time.",
    ]},
  ],
  "the-recipe-in-the-margin": [
    { title: "Grandma Ruth's Card", paragraphs: [
      "After Ruth Bennett died, her daughters found the recipe card for Sunday apple pie tucked inside a flour-stained cookbook. Beside the ordinary ingredients, she had written one mysterious instruction: Add one generous measure of what cannot be bought.",
      "The family debated whether she meant patience, love, or the cinnamon she kept in an unmarked jar. On Ruth's birthday, three generations gathered in her kitchen to make the pie together.",
      "The first attempt went badly. The youngest children argued over the peeler, the crust tore, and Ruth's eldest daughter insisted everyone was rolling the dough incorrectly.",
    ]},
    { title: "The Missing Ingredient", paragraphs: [
      "Ruth's grandson Ben searched the cookbook for another clue. He found small notes beside dozens of recipes: ask about school, let Rose tell the long version, save the end piece for Walter.",
      "They realized the notes were not cooking instructions. Ruth had used the kitchen to make room for each person, especially when the family was busy or angry or afraid.",
      "So they began again. This time no one rushed. They listened to the children, let each person shape a strip of crust, and told the stories Ruth had heard a hundred times without complaint.",
    ]},
    { title: "One Generous Measure", paragraphs: [
      "The second pie was uneven and leaked caramel onto the oven floor. It was also the closest any of them remembered coming to Ruth's.",
      "Ben wrote the missing ingredient beneath her faded line: time freely given. Everyone signed their name, and the card went back into the cookbook.",
      "They still bake the pie every November. No one measures the final ingredient, but no one begins until every chair in the kitchen is filled.",
    ]},
  ],
};
