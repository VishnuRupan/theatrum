const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  return {
    env: {
      API_KEY: "421195ef",
      TMDB_API_KEY: "9cd411b9384bcae5a1edd88de22ed045",
    },
  };
};
