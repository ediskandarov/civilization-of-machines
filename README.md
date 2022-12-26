# civilization-of-machines

Проект для стартап акселератора Гознак.

Демонстрация возможностей использования смарт контрактов для взаимодействия цифровых двойников.

## Структура проекта

- `contracts/` - Директория со смарт контрактами
- `docs/` - Директория с сопроводительной документацией
  - [`application-form.md`](./docs/application-form.md) - Документ с заполненными полями для заявки
  - [`presentation.md`](./docs/presentation.md) - Презентация проекта
  - [`project-management.md`](./docs/project-management.md) - Документ с управлением проекта
  - [`sequence-diagrams.md`](./docs/sequence-diagrams.md) - Диаграммы для презентации
- `test/` - Директория с тестовыми сценариями и примерами использования смарт контрактов

## Установка

### [fnm](https://github.com/Schniz/fnm)

Следуйте инструкциям установки `fnm`.

### npm

Активируйте `Node.js` окружение командой

```console
$ fnm use
```

Далее установка npm пакетов

```console
$ npm install
```

### Подготовка окружения [VSCode](https://code.visualstudio.com/)

Для работы в репозитории нужно установить следующие плагины для редактора VSCode

- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) - Редактор слайдов
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - проверка синтаксиса
- [Russian - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-russian)
- [Solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)
- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

## Использование

### Компиляция смарт контрактов

```console
$ npx hardhat compile
```

### Запуск тестов

```console
$ npx hardhat test
```

### Сгенерировать pdf презентацию

```console
$ npx marp docs/presentation.md --pdf
```
