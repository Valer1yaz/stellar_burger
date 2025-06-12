import * as authTokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

const TEST_URL = 'http://localhost:4000';

describe('Интеграционные тесты для страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(TEST_URL);
  });

  describe('Тестирование загрузки ингредиентов и добавления их в конструктор', () => {
    it('Добавление булок и ингредиентов в заказ', () => {
      cy.request('/api/ingredients');
      cy.addIngredientsToConstructor();
      cy.checkConstructorContent();
    });
  });

  describe('Тестирование работы модального окна для ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.openIngredientModal();
    });

    it('Закрытие модального окна по крестику', () => {
      cy.openIngredientModal();
      cy.closeModal();
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.openIngredientModal();
      cy.get('#modals > div:nth-child(2)').click({ force: true });
      cy.get('@modal').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);
      cy.intercept('GET', 'api/auth/tokens', { fixture: 'token.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    });

    it('Полный прогон создания заказа', () => {
      cy.addIngredientsToConstructor();
      cy.createOrder();

      const burgerConstructor = {
        constructorBunTop: cy.get('div > section:nth-child(2) > div'),
        constructoMainIngredient: cy.get('div > section:nth-child(2) > ul > div'),
        constructorBunBottom: cy.get('div > section:nth-child(2) > div:nth-child(3)')
      };

      burgerConstructor.constructorBunTop.contains('Выберите булки');
      burgerConstructor.constructoMainIngredient.contains('Выберите начинку');
      burgerConstructor.constructorBunBottom.contains('Выберите булки');
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});
