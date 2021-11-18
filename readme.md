# Система нотификаций
## Загрузка с сервера
Запрос уходит на урл `https://kopalka.paaashka.ru/api/notifications` и в ответ приходит массив объектов.
```
[
      {
        id: 0,
        force: false,
        title: 'Success text',
        type: 'success',
      },
      {
        id: 1,
        force: true,
        title: 'Danger text',
        type: 'danger',
      },
      {
        id: 2,
        force: false,
        title: 'Regular every day',
        type: 'regular',
      },
    ]
```

## Добавление сообщения

Для добавления нового сообщения, необходимо закоммитить объект вида:

      {
        id: 2,  <-- уникальное значение, автозаполняется из Number(new Date())
        force: true|false,  <-- не скрывать автоматически
        title: 'Regular every day',  <-- текст сообщения
        type: 'success'|'danger'|'regular',  <-- тип сообщения
      },

Итого выглядеть будет так
```javascript
    commit('addNotification', {
        force: true,
        title: 'Check Token Error. ' + error.toString(),
        type: 'danger',
    });
```
