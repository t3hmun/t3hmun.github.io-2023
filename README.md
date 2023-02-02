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


## Todo

- [x] IDE config + Forced formatting
- [ ] Delete default stuff
- [ ] Blog page rendering
    - [ ] Any post rendering working
    - [ ] Slug gen page with layout insertion
- [ ] Custom components for markdown rendering using MDX plugin
    - [ ] p
    - [ ] h1 and others
    - [ ] Code with dark and light
    - [ ] Code that can adjust width
    - [ ] Wider bullet lists that don't look weird (or just make the text wider)
- [ ] GitHub actions for deployment
