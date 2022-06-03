describe("Login Sequence", () => {
  // beforeEach(() => {
  //   cy.intercept("GET", "**/login").as("loginRequest");
  //   cy.wait("@loginRequest");
  // });

  it("After Login, see if admin pages are accessible", () => {
    cy.visit("/");
    cy.findByRole("button", { name: /login/i }).click();
    cy.findByRole("textbox", { hidden: true }).type(Cypress.env("admin"));
    cy.findByPlaceholderText(/password/i).type(Cypress.env("password"));
    cy.findByRole("dialog", { hidden: true })
      .findByRole("button", { name: /login/i, hidden: true })
      .click();
    cy.intercept("GET", "**/login").as("loginRequest");
    cy.wait("@loginRequest");
    cy.findByText(/login successful/i).click();
    cy.findByRole("link", { name: /personnel/i }).click();
    cy.findByRole("button", { name: /new officer record/i }).should("be.visible");
    cy.findByRole("textbox").clear().type("Picard");
    cy.get('a[href*="611564ecd7cc0c6bfad82ad0"]').first().click();
    cy.findByRole("button", { name: /edit/i }).should("be.visible");
    cy.findByRole("button", { name: /upload/i }).should("be.visible");
  });
});
