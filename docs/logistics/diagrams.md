# Диаграммы

## NFT для обмена на токены RUB

Диаграмма не отражает вызовов методов на смарт контрактах NFT и RUB токена.

Взаимодействия с контрактами NFT и RUB токенов происходят неявно при _выпуске/движении/уничтожении_ токенов.

Смотреть [Депозитный сертификат](https://ru.wikipedia.org/wiki/%D0%94%D0%B5%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BD%D1%8B%D0%B9_%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82).

```mermaid
sequenceDiagram
  autoNumber

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

## Счет на оплату(invoice) и квитанция

Боб хочет купить у Алисы NFT ценности. Для резервирования и гарантии платежа при доставке, Алиса выпускает счет на оплату.

Алиса может забрать NFT ценности из резервирования, если счет не оплачен во-время. Этот сценарий не представлен в диаграмме.

```mermaid
sequenceDiagram
  autoNumber

  participant a as Alice
  participant b as Bob
  participant cc as Commerce contract
  participant vc as Value contract

  a->>a: Владеть vNFT

  b->>a: Купить vNFT
  a->>cc: Выпустить счет на оплату

  cc--)b: Отправить invoice NFT

  a--)vc: Отправить vNFT(зарезервировать)

  b->>cc: Оплатить счёт
  b--)cc: Отправить RUB токены для оплаты счёта
  cc--)b: Отправить NFT квитанции(rNFT)

  cc--)a: Отправить RUB токены
  cc->>vc: Сообщить об успешной оплате

  vc->>vc: Выпустить transit vNFT(t-vNFT)
  vc--)a: Отправить t-vNFT

  note over a, b: В процессе доставки, Боб получил транзитный токен
  a--)b: Отправить t-vNFT

  b->>vc: Получить vNFT
  b--)vc: Отправить t-vNFT
  vc--)b: Отправить vNFT
  vc->>vc: Сжечь t-vNFT
```

## Передача ценности

В этой диаграмме, Боб покупает у Алисы ценность. Ценность ассоциирована с токеном выпущенном Алисой. При покупке, Боб получает права на ценность, а Алиса оплату.

Алиса передает токен Бобу через Чарли. При том, что Чарли не должен иметь возможность владеть токеном.

```mermaid
sequenceDiagram
  autoNumber

  participant a as Alice
  participant c as Charlie
  participant b as Bob
  participant vc as Value contract

  note over a: Стоимость NFT ценности 1000 RUB токенов
  a->>a: Создать/иметь NFT ценности(vNFT)

  note over b: Возможно это надо спрятать в контракт
  b->>b: Иметь Exchange NFT(eNFT) для оплаты
  b->>vc: Зарезервировать право
  par
    b--)vc: Отправить eNFT
    a--)vc: Отправить vNFT

    vc->>vc: Выпустить t-vNFT

    vc--)a: Отправить ценность в пути NFT(vtNFT)
  end

  a--)c: Отправить t-vNFT
  c--)b: Отправить t-vNFT
  b--)vc: Отправить t-vNFT
  vc--)b: Отправить vNFT
  vc--)a: Отправить eNFT
  vc->>vc: Сжечь t-vNFT

  a->>a: Обменять eNFT на RUB токены

  b->>b: Воспользоваться правом владения vNFT
```
