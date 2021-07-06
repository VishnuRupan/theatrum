describe("Register Yoda", () => {
  it("successfully loads signup", () => {
    cy.visit("localhost:3000/signup");
    cy.clearCookies();
  });

  it("signup user", () => {
    cy.get("#name").type("Yoda");

    cy.get("#email")
      .type("yoda@jedi.com")
      .should("have.value", "yoda@jedi.com");

    cy.get("#password").type("Qwer!234");

    cy.get("form").submit();

    cy.location("pathname").should("eq", "/login");
  });
});

describe("Register Vader", () => {
  it("successfully loads signup", () => {
    cy.visit("localhost:3000/signup");
    cy.clearCookies();
  });

  it("signup user", () => {
    cy.get("#name").type("Vader");

    cy.get("#email")
      .type("darthvader@sith.com")
      .should("have.value", "darthvader@sith.com");

    cy.get("#password").type("Qwer!234");

    cy.get("form").submit();

    cy.location("pathname").should("eq", "/login");
  });
});
