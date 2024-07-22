# Redmine Playwright Tests

## Project Overview

This project contains automated tests for the Redmine website using Playwright. The tests check the functionality of various elements on the site and interactions with them.

To run the tests, you need to have the following installed on your machine:
- Node.js (>=14.x)
- npm (>=6.x)
- Playwright (>=1.0.0)
- Allure Commandline (>=2.13.8)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/redmine-playwright-tests.git
    cd redmine-playwright-tests
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Install Playwright and browser dependencies:

    ```bash
    npx playwright install
    ```

4. Install Allure command line:

    ```bash
    npm install --save-dev allure-commandline allure-playwright
    ```



## Steps to Launch

To run the tests, use one of the following commands:

- **Run all tests in all browsers**:

    ```bash
    npm run test:e2e:all-browsers
    ```

- **Run tests in Chromium**:

    ```bash
    npm run test:e2e:chromium
    ```

- **Run tests in all browsers with Allure reporting**:

    ```bash
    npm run test:e2e:all-browsers:allure
    ```

- **Run tests in Chromium with Allure reporting**:

    ```bash
    npm run test:e2e:chromium:allure
    ```

- **Run tests in Chromium in headed mode with Allure reporting**:

    ```bash
    npm run test:e2e:chromium:headed:allure
    ```

## Generating and Viewing Reports

To generate and view Allure reports, use the following commands:

1. **Generate the report**:

    ```bash
    npm run allure:generate
    ```

2. **Open the report**:

    ```bash
    npm run allure:open
    ```

## Project Structure

- `tests/` - Directory containing test files.
- `pages/` - Directory containing Page Object classes.
- `utils/` - Directory for utility functions and data.
- `data/` - Directory for storing test data.
- `README.md` - This file.