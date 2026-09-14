import { defineCliConfig } from 'sanity/cli';
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  /**
   * Where `sanity deploy` publishes the Studio: np88solar.sanity.studio.
   *
   * Written down rather than typed at the prompt, so the address cannot drift
   * between whoever deploys next and the one NP88 has bookmarked. Sanity
   * hostnames are global — if this one is taken the deploy says so, and the
   * only thing to change is this line.
   *
   * Publishing the Studio does not publish content: the address is reachable,
   * but reading or editing anything behind it still requires a Sanity login
   * with access to this project.
   */
  studioHost: 'np88solar',
  deployment: { autoUpdates: false },
});
