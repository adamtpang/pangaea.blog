# The ranked indexes

Reverse engineer, then forward engineer. Each index below is a `ranked` video
episode (the Van Neistat segment) and a study queue at the same time.

Data pulled from Wikipedia, 2026-08-02. Where a number is soft, it says so.

---

## 1. Musicians, by certified sales

Top of the list, by certified units. 127 artists parsed across the tiers.

**250M+** The Beatles · Michael Jackson · Elvis Presley · Elton John · Queen ·
Madonna · Led Zeppelin · Rihanna · Pink Floyd

**200M+** Eminem · Mariah Carey · Whitney Houston · Taylor Swift · Beyoncé ·
Ed Sheeran · AC/DC · Eagles · Celine Dion · The Rolling Stones

**120M+** Drake · Garth Brooks · Kanye West · Coldplay · Billy Joel · Katy Perry ·
Justin Bieber · Bruno Mars · Britney Spears · Metallica · Bruce Springsteen ·
U2 · Aerosmith · Phil Collins · Barbra Streisand · ABBA · Julio Iglesias ·
Frank Sinatra · Jay-Z · Lady Gaga · Adele · Red Hot Chili Peppers · Bon Jovi ·
Fleetwood Mac · Rod Stewart · Bee Gees · Dire Straits

**100M+** Nicki Minaj · Linkin Park · George Strait · Journey · Pink ·
Guns N' Roses · Shania Twain · B'z · Backstreet Boys · Eric Clapton · Prince ·
Paul McCartney · Janet Jackson · The Doors · Santana · Simon & Garfunkel ·
The Beach Boys · George Michael · Bob Dylan · Cher · The Carpenters ·
Earth, Wind & Fire · David Bowie · Stevie Wonder · Genesis · Tina Turner ·
Diana Ross · The Supremes

**80M+ / 75M+** Shakira · Ariana Grande · Alicia Keys · Lionel Richie ·
Andrea Bocelli · Johnny Cash · Pearl Jam · R.E.M. · Post Malone · Usher ·
Van Halen · Ayumi Hamasaki · Tom Petty · The Weeknd · Imagine Dragons ·
Tupac Shakur · Nirvana · Oasis · Green Day · Enya · **Bob Marley** ·
The Police · Kiss · Aretha Franklin

**What it teaches:** almost nobody in the top tier had a short run. The pattern
is a **deep catalogue sustained over decades**, then reinvention. Not one hit,
not one album, and never one year. This is the pillar where volume is
literally the winning move, which is the case for the 1,000.

---

## 2. Engineers, by the Turing Award

The most defensible quantitative list in computing. 42 solo laureates parsed:

Alan Perlis · Maurice Wilkes · **Richard Hamming** · Marvin Minsky ·
James H. Wilkinson · John McCarthy · **Edsger W. Dijkstra** · Charles Bachman ·
**Donald Knuth** · John Backus · Robert W. Floyd · Kenneth E. Iverson ·
**Tony Hoare** · Edgar F. Codd · Stephen Cook · Niklaus Wirth · Richard M. Karp ·
John Cocke · **Ivan Sutherland** · William Kahan · Fernando J. Corbató ·
Robin Milner · Butler Lampson · Manuel Blum · Amir Pnueli ·
**Douglas Engelbart** · Jim Gray · **Fred Brooks** · Andrew Yao · **Alan Kay** ·
Peter Naur · Frances Allen · Barbara Liskov · Charles P. Thacker ·
Leslie Valiant · Judea Pearl · Leslie Lamport · Michael Stonebraker ·
**Tim Berners-Lee** · Jack Dongarra · Robert Metcalfe · Avi Wigderson

*Incomplete on purpose:* roughly 37 more come from shared-award years that the
parser could not extract cleanly (Thompson and Ritchie, Rivest Shamir and
Adleman, Diffie and Hellman, Hinton LeCun and Bengio, Newell and Simon, and
others). Worth completing by hand before filming.

**What it teaches:** the opposite of the musicians. Nobody wins a Turing for
volume. They win for **one contribution everyone else then builds on top of.**
Depth, not catalogue. Dijkstra did not ship a thousand algorithms.

---

## 3. "Influencers", by YouTube subscribers

Top 20 of 99 parsed:

| # | Channel | Subs |
|---|---|---|
| 1 | MrBeast | 510M |
| 2 | T-Series | 314M |
| 3 | Cocomelon | 202M |
| 4 | SET India | 189M |
| 5 | Vlad and Niki | 150M |
| 6 | Stokes Twins | 143M |
| 7 | Kids Diana Show | 138M |
| 8 | 김프로KIMPRO | 134M |
| 9 | Like Nastya | 133M |
| 10 | Zee Music Company | 122M |
| 11 | Alejo Igoa | 120M |
| 12 | WWE | 113M |
| 13 | PewDiePie | 110M |
| 14 | Goldmines | 110M |
| 15 | Sony SAB | 106M |
| 16 | Blackpink | 101M |

**What it teaches, and this is the real finding:** the list is almost entirely
**children's content, Indian music and TV labels, and wrestling.** Of the top
fifteen, roughly two are individual creators making things they chose to make.

So subscriber count does not measure craft, taste, or influence. It measures
**reach into the largest available undifferentiated audience**, which is
toddlers and back catalogues.

This is your own thesis, confirmed by the data: *a view from a hero is worth
more than 100k from randos.* Do not model this pillar on this list. The right
model for a creator is Van Neistat (about 1M subscribers and total creative
control), not T-Series.

---

## The synthesis

Three lists, three completely different games:

| Domain | Win condition | Time shape |
|---|---|---|
| **Musicians** | deep catalogue, sustained decades | volume over time |
| **Engineers** | one contribution others build on | depth, once |
| **Influencers** | undifferentiated reach | neither, mostly |

**The mistake would be to play all three the same way.** The 1,000 frame is
correct for songs and essays, where catalogue compounds. It is the wrong frame
for apps, where one thing that others build on beats a thousand that nobody
does. And it is entirely the wrong frame for audience, where the number to
optimise is not the number at all.

**Practical read for the pillars:**

- **Songs and essays** → play the musicians' game. Volume, decades, catalogue.
- **Apps** → play the engineers' game. One that matters beats 46 that do not.
- **Video and audience** → play neither. Optimise for the ten right people.

---

## As episodes

Each index is a `ranked` segment for the channel, and each has an argument
rather than just a list:

1. **"Nobody great had a short run"** · the musicians index
2. **"Dijkstra never shipped a thousand algorithms"** · engineers, and the case
   against volume
3. **"The most-subscribed channels are for toddlers"** · why the metric lies
4. **"The two lists agree on two people"** · songwriters, already researched in
   `SONGWRITERS.md`
