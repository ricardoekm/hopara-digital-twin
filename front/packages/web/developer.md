## Type script

### I'm getting "Could not find a declaration file for module. What should I do"?

This means type script wasn't able to find the type definition for a given module. 

Try to install the type definition by using the following command:

```
npm install --save-dev @types/moudule-name
```

This will try to fetch the type from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types). If you get an error, create a file with .d.ts extension and add the module to it:

```
declare module "module-name";
```

This will make type script consider any type from this module as *any*.

## General

### Debugging tips

Passing ```debug=true``` will enable troubleshooting information including:
* logs of Redux actions,
* internal columns on Tooltip




