# redmine-playwrigt-tests
## Requirements

To run the tests, you need to have the following installed on your machine:
- Node.js (>=14.x)
- npm (>=6.x)
- Playwright (>=1.0.0)
- Allure Commandline (>=2.13.8)
- axios: (>=1.7.2)

## Steps to Install

1. Paywright:
    ```bash
    npm install playwright@latest
    ```
2. axios:
    ```bash
    npm install axios
    ```
3. Install Allure:
    ```bash
    npm install --save-dev allure-commandline
    npm install --save-dev allure-playwright
    ```
4. Install the dependencies:
    ```bash
    npm install
    ```


## Steps to Launch

To run the tests, use the following command:
```bash
npx playwright test
```

## Steps to create the report

Generate Allure Report:
```bash
allure generate allure-results -o allure-report --clean
```

Open Allure Report:
```bash
allure open allure-report
```