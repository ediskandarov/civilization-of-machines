## Дорожная карта

```mermaid
gantt
    title       Отправить проект в ГОЗНАК акселератор
    dateFormat  YYYY-MM-DD
    axisFormat  %a

    %% GitHub raises an error if tick interval is set
    %% tickInterval 1day

    section Презентация
    Заполнить анкету          :done,    des1, 2022-12-20, 1d
    Идентификация             :active,  des2, after des1, 1d
    Проработать услугу        :         des3, after des2, 1d
    Проработать кейсы ГОЗНАК  :         des4, after des3, 1d
    Свободный день            :         des5, after des4, 1d
    Отправить проект          :crit,   milestone      des6, after des5, 1d
```

## TODO

- [ ] отправить заявку до в ГОЗНАК до 26 декабря 2022
      Ссылка [Акселератор «Goznak Startup Lab»](https://accelerator.goznak.ru/)
- [x] Сделать анкету проекта
- [ ] Сделать презентацию проекта
- [x] Сделать анализ конкурентов
- [ ] Определить предполагаемый экономический эффект для ГОЗНАК
- [x] Переименовать `gas` в `fuel`
- [ ] Разместить на GitHub Pages
