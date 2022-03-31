describe("Login Sequence", () => {
  // beforeEach(() => {
  //   cy.intercept("GET", "**/login").as("loginRequest");
  //   cy.wait("@loginRequest");
  // });

  it("see if a regular user has access to admin pages", () => {
    cy.visit("/");
    cy.findByRole("link", { name: /personnel/i }).click();
    cy.findByRole("button", { name: /new officer record/i }).should("not.exist");
    cy.findByRole("textbox").clear().type("Picard");
    cy.get('a[href*="611564ecd7cc0c6bfad82ad0"]').first().click();
    cy.findByRole("button", { name: /edit/i }).should("not.exist");
    cy.findByRole("button", { name: /upload/i }).should("not.exist");
  });
});
