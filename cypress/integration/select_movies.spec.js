const movieNames = [
  { title: "king kong", year: "2021" },
  { title: "avengers", year: "2015" },
  { title: "batman", year: "2015" },
  { title: "star wars", year: "2021" },
  { title: "spider-man", year: "2021" },
  { title: "star trek", year: "2021" },
];

describe("Favourite movies", () => {
  it("heart movies", () => {
    cy.visit("/login");
    cy.get("#loginemail")
      .type("yoda@jedi.com")
      .should("have.value", "yoda@jedi.com");
    cy.get("#loginpassword").type("Qwer!234");

    cy.get("form").submit();
    cy.location("pathname").should("eq", "/profile");

    cy.get("h1").should("contain", "Yoda");

    for (let i = 0; i < movieNames.length; i++) {
      cy.get("#search-movie-btn").click();
      cy.get(".title-input").type(movieNames[i].title);
      cy.get("form").submit();
      cy.wait(1000);
      cy.get(".heart-select:first").click();
    }

    cy.get("#search-movie-btn").click();
    cy.get(".title-input").type(movieNames[5].title);
    cy.get("form").submit();
    cy.get(".heart-select:first").click();
    cy.get(".close-btn").click();
    cy.wait(1000);
    cy.get(".profile-icon-btn").click();
    cy.wait(1000);
    cy.get(".poster-ctn").should("have.length", 5);

    cy.contains("Logout").click();
  });
});

describe("Remove favourites", () => {
  it("click and confirm remove movie from list", () => {
    cy.visit("/login");
    cy.get("#loginemail")
      .type("yoda@jedi.com")
      .should("have.value", "yoda@jedi.com");
    cy.get("#loginpassword").type("Qwer!234");

    cy.get("form").submit();
    cy.location("pathname").should("eq", "/profile");

    cy.get("h1").should("contain", "Yoda");

    for (let i = 0; i < 5; i++) {
      //cy.wait(2000);
      cy.wait(1000);
      cy.get(".remove-btn-profile:first").click();
      cy.get(".yes-btn").click();
    }

    //cy.contains("Logout").click();
  });
});
