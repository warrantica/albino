# Albino for Pantip
A Pantip reader/third-party client, in the form of a Chrome extension.
This project is currently a work in progress.

## Build Instructions
### Requirements
- Install node/npm [here](https://nodejs.org/en/).

### Environment Setup
- Clone the repository
```bash
git clone https://github.com/warrantica/albino.git
cd albino
```

- Install browserify globally
```bash
npm install -g browserify
```

- Install other packages
```bash
npm install
```
This will create a `node_modules` directory, containing vueify, babel and their dependencies.

### Actually Building the Thing
- Run
```
npm run build
```
This will run browserify and vueify.

- check the `/build/` directory.
