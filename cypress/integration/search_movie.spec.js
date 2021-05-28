const movieNames = [
  { title: "king kong", year: "2021" },
  { title: "avengers", year: "2015" },
  { title: "fafjapofsjaojfpa", year: "2021" },
  { title: "spider-man", year: "2021" },
];

describe("Search movies without year", () => {
  it("visit homepage", () => {
    cy.visit("/");
  });

  for (let i = 0; i < movieNames.length; i++) {
    it(`search for ${movieNames[i].title}`, () => {
      cy.log(`${movieNames[i].title}`);
      cy.get(".title-input").type(`${movieNames[i].title}`);

      cy.get("form").submit();
      cy.wait(2000);

      cy.get("body").then((body) => {
        if (body.find("#not-fonud-movie").length > 0) {
          cy.log(`${movieNames[i].title} movie was not found`);
          cy.wait(500);
          cy.get("#search-movie-btn").click();
        } else {
          cy.log(`${movieNames[i].title} movie was found`);
          cy.get(".image-poster:first").click();
          cy.wait(500);
          cy.url("pathname").should("include", "/movie");
          cy.get("#search-movie-btn").click();
        }
      });
    });
  }
});

describe("Search movies with year", () => {
  it("visit homepage", () => {
    cy.visit("/");
  });

  for (let i = 0; i < movieNames.length; i++) {
    it(`search for ${movieNames[i].title}`, () => {
      cy.log(`${movieNames[i].title}`);
      cy.get(".title-input").type(`${movieNames[i].title}`);
      cy.get(".year-input").type(`${movieNames[i].year}`);

      cy.get("form").submit();
      cy.wait(2000);

      cy.get("body").then((body) => {
        if (body.find("#not-fonud-movie").length > 0) {
          cy.log(`${movieNames[i].title} movie was not found`);
          cy.wait(500);
          cy.get("#search-movie-btn").click();
        } else {
          cy.log(`${movieNames[i].title} movie was found`);
          cy.get(".image-poster:first").click();
          cy.wait(500);
          cy.get("#search-movie-btn").click();
        }
      });
    });
  }
});
