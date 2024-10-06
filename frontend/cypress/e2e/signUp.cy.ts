describe("authentication", () => {
    it("sign-up", function() {
        const email = `email-${Date.now()}@example.com`;

        cy.visit(Cypress.env("CYPRESS_HOST"));
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("a").contains("Sign up").click();
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/auth/sign-up");
        cy.get("h1").contains("Sign up").should("be.visible");
        cy.get("input#email").type(email);
        cy.get("input#firstname").type("John");
        cy.get("input#lastname").type("Doe");
        cy.get("input#password").type("password");
        cy.contains("Accept terms and conditions").click();
        cy.get("button").contains("Sign up").click();
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("#email").clear();
        cy.get("#email").type(email);
        cy.get("#password").clear();
        cy.get("#password").type("password");
        cy.get("button").contains("Sign in").click();
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en");
    });
});
