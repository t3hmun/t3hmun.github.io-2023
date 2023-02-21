/* Helpers for consistently formatting specific kinds of things in a human friendly way. */

/** Human readable date, the date parameter must work as the argument for new Date(..). */
export function friendlyDate(date: any) {
    // TODO: Use something like dateFns to only output day of the week for recent posts.
    const d = new Date(date);
    return d.toDateString();
}
