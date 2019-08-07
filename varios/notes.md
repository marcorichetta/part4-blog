## NPM Project

1. Inicializar: `npm init`
2. Instalar dependencias: `npm install express cors mongoose body-parser dotenv --save`
3. Instalar dependencias (DEV): `npm install nodemon jest eslint --save-dev `
4. `./node_modules/.bin/eslint --init`

**package.json**
```javascript
"scripts": {
    "start": "node index.js",
    "watch": "nodemon index.js",
    "test": "jest --verbose",
    "lint": "eslint ."
  }

// Al final agregar jest config
  "jest": {
    "testEnvironment": "node"
  }
```


**.eslintrc.js**
```javascript
"env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true,
    },
```