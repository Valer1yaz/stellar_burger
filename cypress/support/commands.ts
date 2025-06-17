/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Добавляет ингредиенты в конструктор бургера
       */
      addIngredientsToConstructor(): Chainable<void>
      
      /**
       * Проверяет содержимое конструктора бургера
       */
      checkConstructorContent(): Chainable<void>
      
      /**
       * Открывает и проверяет модальное окно ингредиента
       */
      openIngredientModal(): Chainable<void>
      
      /**
       * Закрывает модальное окно
       */
      closeModal(): Chainable<void>
      
      /**
       * Создает заказ
       */
      createOrder(): Chainable<void>
    }
  }
}

const TEST_URL = 'http://localhost:4000';

Cypress.Commands.add('addIngredientsToConstructor', () => {
  cy.get(`[data-cy=bun] > .common_button`).first().click();
  cy.get(`[data-cy=main] > .common_button`).first().click();
  cy.get(`[data-cy=sauce] > .common_button`).first().click();
});

Cypress.Commands.add('checkConstructorContent', () => {
  const burgerConstructor = {
    bunTop: cy.get('.constructor-element > .constructor-element__row > .constructor-element__text').first(),
    mainIngredient: cy.get('.constructor-element > .constructor-element__row > .constructor-element__text').eq(1),
    sauceIngredient: cy.get('.constructor-element > .constructor-element__row > .constructor-element__text').eq(2),
    bunBottom: cy.get('.constructor-element > .constructor-element__row > .constructor-element__text').last()
  };

  burgerConstructor.bunTop.contains('Краторная булка N-200i (верх)');
  burgerConstructor.mainIngredient.contains('Биокотлета из марсианской Магнолии');
  burgerConstructor.sauceIngredient.contains('Соус Spicy-X');
  burgerConstructor.bunBottom.contains('Краторная булка N-200i (низ)');
});

Cypress.Commands.add('openIngredientModal', () => {
  cy.get(`[data-cy=bun]`).first().click();
  const modal = cy.get('#modals > div:first-child');
  const header = modal.get('div:first-child > h3');
  header.contains('Краторная булка N-200i');
});

Cypress.Commands.add('closeModal', () => {
  cy.get('#modals > div:first-child').as('modal')
    .get('div:first-child > button > svg').click();
  cy.get('@modal').should('not.exist');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('#root > div > main > div > section:nth-child(2) > div > button').click();
  const orderModal = cy.get('#modals > div:first-child');
  const orderNumber = orderModal.get('div:nth-child(2) > h2');
  orderNumber.contains(orderData.order.number);
  orderModal.get('div:first-child > div:first-child > button > svg').click();
  cy.get('@modal').should('not.exist');
});

export {};