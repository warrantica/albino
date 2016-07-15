# Albino for Pantip
A Pantip reader/third-party client, in the form of a Chrome extension.
This project is currently a work in progress.

## Build Instructions
### Requirements
Install node/npm [here](https://nodejs.org/en/).

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/warrantica/albino.git
cd albino
```

2. Install browserify globally
```bash
npm install -g browserify
```

3. Install other packages
```bash
npm install
```
This will create a `node_modules` directory, containing vueify, babel and their dependencies.

### Actually Building the Thing
1. Run
```
npm run build
```
This will run browserify and vueify.

2. check the `/build/` directory.
