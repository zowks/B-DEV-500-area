describe("authentication", () => {
    const email = `email-${Date.now()}@example.com`;

    function signIn() {
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/auth/sign-in");
        cy.get("h1").contains("Sign in").should("be.visible");
        cy.get("input#email").clear().type(email);
        cy.get("input#password").clear().type("password");
        cy.get("button").contains("Sign in").click();
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/dashboard");
    }

    it("sign-up", () => {
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
        signIn();
    });

    it("sign-in", () => {
        cy.visit(Cypress.env("CYPRESS_HOST"));
        signIn();
    });

    it("sign-in", () => {
        cy.visit(Cypress.env("CYPRESS_HOST"));
        signIn();
        cy.get("span").contains("Sign out")
            .should("have.class", "sr-only")
            .should("be.visible")
            .parent("a")
            .click();
        cy.get("h1").contains("Sign out").should("be.visible");
        cy.get("button").contains("Sign out").click();
        cy.location("pathname", { timeout: 60000 }).should("eq", "/en/auth/sign-in");
    });
});
