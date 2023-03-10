# t3h site

The website, 2023 re-write.

## Goals

Core site goal:

- Astro 2
    - Content Collections
- Use MDX to do custom components for all the markdown
    - The main purpose of this is nice code components
        - Maybe look at how Astro docs does it
    - See if it can be setup to keep astro-specific things like layout out of the posts
    - It is nice to keep the content framework agnostic
- Tailwind with dark and light themes
    - Will make more sense with writing more components
    - Don't want to use typography plugin
    - Only dark and light, don't complicate the code for more themes I'll never write

Extra Goals:

- Find an excuse to use Zod
- Find an excuse to use TanStack Router
- Find reasons to write React, SolidJS and Svelte components, in islands


## No-Goals

- pnpm
  - It is nice and fast but breaks prettier, getting in the way more than being interesting
- monorepo
  - This is something to do later when there is more than one project
  - nx looks interesting but extremely unnecessary
  - Will probably try yarn workspaces because I'm avoiding pnpm due to issues
- typewind
  - Don't really need it, installing is a complication

## Design Ideas

### Text Width

I've been doing variable text width, ~65ch for blocks of text and wider for bullet list and code.
I might change to 80-90ch for everything, looks more consistent.
I don't write big enough blocks of text for the ~65ch reading width to matter.
I get the feel that wider is more readable for sparse small blocks of technical text with code interpolated into it. 
The [Astro docs](https://docs.astro.build/en/install/auto/) are a good example of what I'm finding comfy to read.

The rare code blocks that needs more than 80ch should be expandable (implement as a hydrated component?).
A key point here is the **site must load perfectly without js** - this needs to include themes via system settings.

## Todo

- [x] IDE config + Forced formatting
- [x] Delete default stuff
- [ ] Layout
  - [x] Header
  - [x] Nice light dark toggle component (in React since that's easy)
      - [x] Fix SSG for the theme toggle (move window usage into effect)
      - [x] Re-write in Preact (smaller than React)
      - [ ] It might be interesting to see how this component turns out in SolidJs or Svelte 
  - [x] Footer 
  - [ ] Date in article
- [x] Blog page rendering
    - [x] Any post rendering working
    - [x] Slug gen page with layout insertion
- [ ] Custom components for markdown rendering using MDX plugin
    - [x] Decide on 2xl vs 3xl vs 80ch/100ch container (then no max-w for headings)
        - 3xl is nice and a universal
        - ch widths only make sense for standard size text, will only line up with same size text
        - Headings need a max-w to not look odd. Would need a underline or background if different width to text.
        - Will need to review when font.
    - [x] p
    - [x] h2 h3
    - [x] h4 + 
    - [x] a
    - [x] em
    - [x] strong
    - [x] code
      - [ ] Fix The not-pre selector is wrong, causing indent on first line of pre.
    - [x] pre with dark and light
    - [x] pre that can adjust width
      - [x] preact component?
    - [ ] document remark plugin
    - [x] Why are there giant gaps under the headings?
    - [x] Make sure code displays without js
        - [x] Make sure the `var(--display-dark)` has a default value of `block` without js to set it - there is a fallback value syntax.
- [x] The entire light themes
    - [ ] Is it really ok? 
        - [ ] The header isn't shaded
        - [ ] No accents
        - [ ] Look at some other light theme sites for ideas
    - [ ] Redo the test page to be more compressed so I can see more of what is wrong.
- [ ] GitHub actions for deployment
- [ ] Fonts
- [ ] Filenames are slugs! 
  - [ ] group by year?
  - [ ] rename them all to get good slugs
