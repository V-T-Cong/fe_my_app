// 1. For importing plain CSS files (like your global.css)
declare module "*.css" {
  // We declare that importing any file ending in .css will simply have a side-effect,
  // meaning it does not export anything, but it is valid to import.
}

// 2. (Optional, but recommended) For CSS Modules
// If you use CSS Modules (e.g., component.module.css), this will correctly type the imported object.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
