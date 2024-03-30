# t3hmun's website re-write 2024

Ok, not a full re-write yet, just major version bumps. Maybe I'll go the whole of 2024 without a full re-write.

## Goals

- [x] Update all the packages
- [x] Fix stuff that's changed
- [x] Make it look less bad
  - It isn't as bad anymore
    - Thats a lie the bullets look like hell
    - [ ] Fix `ul` appearance
    - [ ] Maybe increase line spacing

## Plan

- [x] Choose npm
  - I don't like yarn anymore, pnpm complicates things, nx is more than just complicated, npm is fine, it is simple
  - Using Node 20, Astro needs 18+, this is fine

- [x] `npm create astro@lastest`
  - Strictest Typescript
  - Empty project
  - Installed Astro 4.4.0, it is the latest

- [x] Configure editor stuff
  - [x] Update editorconfig
    - [x] VsCode
      - [x] Prettier plugins
      - [x] Format on save 
        - But not for markdown, prettier makes a mess of it
        - Formatting mdx is fine, it isn't really markdown anymore.
        - Markdown is meant to be manually fudged to improve readability.

- [x] Install Astro plugins
  - `npx astro add mdx preact tailwind`
- [x] Merge into last years code
- [x] Remove fonts
  - The old fonts don't feel great.
- [x] Re-format everything (because Prettier 3 came out)
- [ ] Read the changelogs
  - [ ] `astro`: 2.0.14 -> 4.4.0
  - [ ] `@astrojs/mdx`: 0.18 -> 2.1.1
  - [ ] `preact`: 10.12.1 -> 10.19.5
  - [ ] `@astrojs/preact`: 2.0.3 -> 3.1.0
  - [x] `shiki`: 0.14.1 -> 1.1.5
  - [ ] `tailwind`: 3.2.7 -> 3.4.1
  - [ ] `@astrojs/tailwind`: 3.0.1 -> 5.1.0
- [x] Fix Shiki
  - Major version change, it looks like even Astro is a bit behind
  - A list of languages is now required
  - 
- [x] Decide on new fonts
  - Defaults are fine?
    - Yes
- [ ] Get rid of excessive comments in prod html output (every single `p` has a massive block comment)
  - Why are there comments in the built output?



**Everything below here is Astro readme stuff**

## ?? Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
+-- public/
+-- src/
�   +-- pages/
�       +-- index.astro
+-- package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## ?? Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ?? Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).





**below here is the 2023 readme**




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
- [x] Custom components for markdown rendering using MDX plugin
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
      - [x] Fix The not-pre selector is wrong, causing indent on first line of pre.
    - [x] pre with dark and light
    - [x] pre that can adjust width
      - [x] preact component?
    - [x] document remark plugin
    - [x] Why are there giant gaps under the headings?
    - [x] Make sure code displays without js
        - [x] Make sure the `var(--display-dark)` has a default value of `block` without js to set it - there is a fallback value syntax.
- [x] The entire light themes
    - [ ] Is it really ok? 
        - [ ] The header isn't shaded
        - [ ] No accents
        - [ ] Look at some other light theme sites for ideas
    - [ ] Redo the test page to be more compressed so I can see more of what is wrong.
- [x] GitHub actions for deployment
    - [x] Deploy live
- [ ] Fonts
- [x] Filenames are slugs! 
  - [x] group by year?
  - [x] rename them all to get good slugs
