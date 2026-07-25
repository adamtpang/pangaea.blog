// Poor Adam's Almanack — manuscript source
// =========================================
// Compressed layout: cover + 8 themed lists, each line labelled A1...H15.
// Char-sorted within each theme. ~5 min read at 170 WPM.

#let book = json("corpus/keepers.json")

// ============ DOCUMENT METADATA ============

#set document(
  title: book.title,
  author: book.author,
  description: book.title,
)

// ============ PAGE / TYPOGRAPHY ============

#set page(
  width: 5in,
  height: 8in,
  margin: (top: 0.7in, bottom: 0.7in, inside: 0.7in, outside: 0.55in),
)

#set text(
  font: "EB Garamond",
  size: 10.5pt,
  lang: "en",
  number-type: "old-style",
)

#set par(leading: 0.55em, justify: false, first-line-indent: 0pt)

// ============ HELPERS ============

#let theme-heading(letter, name) = {
  v(0.55em)
  block(below: 0.85em)[
    #text(size: 8.5pt, tracking: 0.32em, fill: rgb("#888"))[
      #upper(letter + " · " + name)
    ]
  ]
}

#let item(label, body) = block(
  width: 100%,
  above: 0pt,
  below: 0.42em,
  breakable: false,
)[
  #grid(
    columns: (0.5in, 1fr),
    column-gutter: 0.12in,
    align: (top, top),
    text(
      size: 8pt,
      tracking: 0.06em,
      fill: rgb("#999"),
      number-type: "lining",
    )[#label],
    text(size: 10.5pt)[#body],
  )
]

// ============ COVER ============

#v(2.4in)
#align(center)[
  #text(size: 28pt, weight: 500, tracking: 0.005em)[#book.title]
  #v(2.6in)
  #text(size: 8.5pt, tracking: 0.32em, fill: rgb("#666"))[
    #book.total_aphorisms APHORISMS · #book.read_time_minutes MIN READ
  ]
]
#pagebreak()

// ============ THE BOOK ============

#for theme in book.themes {
  theme-heading(theme.letter, theme.name)
  for (i, line) in theme.aphorisms.enumerate() {
    item(theme.letter + str(i + 1), line)
  }
  v(0.6em)
}
