#Docker

Вначале соберем image с приложением

```
docker image build -t booking-react .
```

Подготовим контейнер
```
docker-compose up -d
```

Приложение будет доступно на порту 8080

В компосер файле:
- `BOOKING_EXTERNAL_LINK_URL` ссылка на внешнее приложение
- `BOOKING_EXTERNAL_LINK_DESCRIPTION` тект ссылки

