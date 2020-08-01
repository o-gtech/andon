# andon

## Project setup
### Set node version
#### Using nvm
Before installing dependencies set the default node version using `nvm`:
```
nvm use
```
#### Others
You can also install it by
1. Checking the default version in the [`.nvmrc` file](https://github.com/o-gtech/andon/blob/master/.nvmrc) in the root directory
2. Installing it using your preferred method ([node official site](https://nodejs.org), `brew`, etc)

### Install dependencies:
```
yarn install
```
Eventhough `npm` could also be used, `yarn` is preferred over `npm`.

### Run it locally
```
yarn serve
```

### Build for production (compiles & minifies)
```
yarn build
```

### Lint and fix files
```
yarn lint
```
