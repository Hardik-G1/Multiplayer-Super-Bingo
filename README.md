
## To-Dos
- [ ] **Architecture change** : Change the overall architecture
- [ ] **Design Components**: Design the components.
  - [x] 70% design done
  - [ ] Timer , Turn Indicator, Grid for sizes 7 to 10 , Saved Grid column
  - [ ] Dark theme
- [ ] **Deploy**: Deploy on the domain.
- [ ] **Create a Readme**: Description of the functionalities.

## Bugs

- [x] Saved Grids can be loaded even when the game is started.
- [x] Game starts with the timer mode enabled but time not selected. 
- [x] Buttons should occupy the same height and width.
- [x] When clicked on show key change to hide key 
- [ ] Remove unused code/props and prop drilling
- [x] Cannot exit until refresh for bad key
- [ ] if both player tied proper handling of the game 

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Current Design
![alt text](images/1.png "Title")
![alt text](images/2.png "Options")
![alt text](images/3.png "Grid")
![alt text](images/4.png "Load saved grids")
![alt text](images/5.png "Game in session")

