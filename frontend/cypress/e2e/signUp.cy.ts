describe("authentication", () => {
    it("sign-up", function() {
        cy.visit(Cypress.env("CYPRESS_HOST"));
        cy.location("pathname", { timeout: 60000 }).should("include", "/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("a").contains("Sign up").click();
        cy.location("pathname", { timeout: 60000 }).should("include", "/auth/sign-up");
        cy.get("h1").contains("Sign up").should("be.visible");
        cy.get("input#email").type(`email-${Date.now()}@example.com`);
        cy.get("input#firstname").type("John");
        cy.get("input#lastname").type("Doe");
        cy.get("input#password").type("password");
        cy.contains("Accept terms and conditions").click();
        cy.get("button").contains("Sign up").click();
        cy.location("pathname", { timeout: 60000 }).should("include", "/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("#email").clear();
        cy.get("#email").type("email@example.com");
        cy.get("#password").clear();
        cy.get("#password").type("password");
        cy.get("button").contains("Sign in").click();
    });
});
