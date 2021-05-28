describe("Logging in user Yoda", () => {
  it("successfully loads homepage", () => {
    cy.visit("/");
    cy.clearCookies();
  });

  it("go to login page", () => {
    cy.contains("Login").click();
  });

  it("login test", () => {
    cy.get("#loginemail")
      .type("yoda@jedi.com")
      .should("have.value", "yoda@jedi.com");
    cy.get("#loginpassword").type("Qwer!234");

    cy.get("form").submit();

    cy.location("pathname").should("eq", "/profile");

    cy.get("h1") // 9.
      .should("contain", "Yoda");
  });
});

describe("Logout user Yoda", () => {
  it("click logout", () => {
    // cy.pause();

    cy.contains("Logout").click();
  });

  it("logout redirect", () => {
    cy.location("pathname").should("eq", "/login");
  });
});
