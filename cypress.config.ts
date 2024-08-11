import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "y5s15c",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
