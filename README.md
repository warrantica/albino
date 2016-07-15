# Albino for Pantip
A Pantip reader/third-party client, in the form of a Chrome extension.
This project is currently a work in progress.

## Build Instructions
### Requirements
Install node/npm [here](https://nodejs.org/en/).

### Environment Setup
1. Clone the repository
       git clone https://github.com/warrantica/albino.git
       cd albino

1. Install browserify globally
       npm install -g browserify

1. Install other packages
       npm install
   This will create a `node_modules` directory, containing vueify, babel and their dependencies.

### Actually Building the Thing
1. Run
       npm run build
   This will run browserify vueify in the background.

1. check the `/build/` directory.
