describe("authentication", () => {
    it("sign-up", function() {
        cy.visit("http://localhost:5173");
        cy.location("pathname", { timeout: 60000 }).should("include", "/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("a").contains("Sign up").click();
        cy.location("pathname", { timeout: 60000 }).should("include", "/auth/sign-up");
        cy.get("h1").contains("Sign up").should("be.visible");
        cy.get("input#email").type("email@example.com"); // TODO: find why it's clear
        cy.get("input#password").type("password");
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
