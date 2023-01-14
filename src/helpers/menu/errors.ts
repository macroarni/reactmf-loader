export enum dynamicLoadErrors {
  component = 'DynamicLoad: Failed to load "component".',
  name = 'The menu component must be exported under the name "Menu"',
  subMenu  = 'The subMenu component must be exported under the name "subMenu" \n ' +
    'You can ignore this error if there is no "subMenu" in the microFrontend.',
}
