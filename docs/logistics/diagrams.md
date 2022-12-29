# NFT для обмена на токены RUB

Диаграмма не отражает вызовов методов на смарт контрактах NFT и RUB токена.

Взаимодействия с контрактами NFT и RUB токенов происходят неявно при _выпуске/движении/уничтожении_ токенов.

```mermaid
sequenceDiagram
  autonumber

  participant a as Alice
  participant b as Bob

  participant ec as Exchange contract

  note over a,ec: Количество токенов RUB задается Alice
  a->>ec: Выпустить NFT обеспеченные RUB токенами

  par
    a--)ec: Переслать RUB токены в количестве N
    ec--)a: Выпустить и отправить NFT
    ec->>ec: Зарегистрировать NFT на RUB токены
  end

  note over a,ec: Далее представлена последовательность, как Bob может воспользоваться NFT

  a--)b: Отправить NFT

  b->>ec: Обменять NFT на RUB токены

  par
    b--)ec: Отправить NFT
    ec->ec: Найти соответствие RUB токенов для NFT
    ec--)b: Отправить RUB токенов в количестве N
    ec->>ec: сжечь NFT
  end
```

## Передача ценности
