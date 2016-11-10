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

- Install webpack globally
```bash
npm install -g webpack
```

- Install other packages
```bash
npm install
```
This will create a `node_modules` directory, containing vue-loader, babel-loader and their dependencies.

### Actually Building the Thing
- Run
```
webpack
```

- check the `/build/` directory.
