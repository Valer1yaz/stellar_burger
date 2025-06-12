import userReducer, { UserState, clearErrors, initialState } from './slice';

import { order, userOrders } from '../../../testData';
import { getOrdersThunk } from './actions';

describe('Тесты синхронных экшенов', () => {
  test('Проверяем очистку заказа', () => {
    const newOrder = userReducer(initialState, clearErrors());
    expect(newOrder.error).toBeNull();
  });
});

describe('Тесты асинхронных экшенов', () => {
  describe('Тестируем getOrdersThunk', () => {
    test('Тестируем отправку запроса (pending)', async () => {
      const newState = userReducer(
        initialState,
        getOrdersThunk.pending('pending')
      );

      expect(newState.ordersRequest).toBeTruthy();
      expect(newState.error).toBeNull();
    });
    test('Тестируем ошибку при запросе (rejected)', async () => {
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка получения заказов пользователя'
      };
      const newState = userReducer(
        initialState,
        getOrdersThunk.rejected(error, 'rejected')
      );

      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });
    test('Тестируем успешный запрос (fulfilled)', async () => {
      const newState = userReducer(
        initialState,
        getOrdersThunk.fulfilled(userOrders, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
