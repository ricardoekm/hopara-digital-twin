# Hopara Iframe Client
This package provides an iframe to add [Hopara](https://hopara.io) visualizations to your project.

# Installing
You can install the iframe as a NPM module or using the Hopara CDN directly:

As a module:
```shell
$ npm install @hopara/iframe
```

Using Hopara CDN:
```html
<script src="https://statics.hopara.app/embedded/latest/client.js"></script>
```

## Authentication
The iframe requires a valid `accessToken`. Use the `Auth API` to fetch it, as explained in our [integration guide](https://docs.hopara.app/#/docs/integration-guide/2-authentication-integration.html)

# Example
### Node.JS
```js
import React from 'react'
import Hopara from 'hopara'

class MyComponent extends React.Component {
  componentDidMount(): void {
    const hopara = Hopara.init({
      visualizationId: 'my-hopara-viz',
      accessToken: 'my-hopara-token',
      targetElementId: 'my-target-element',
    })
  }

  render() {
    <div id="my-target-element" />
  }
}
```

### HTML
```html
<html>
  <head>
    ...
    <script src="https://statics.hopara.app/embedded/latest/client.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function(){
        const hopara = Hopara.init({
          visualizationId: 'my-hopara-viz',
          accessToken: 'my-hopara-token',
          targetElementId: 'my-target-element',
        })
      });
    </script>
  </head>
  <body>
    <div id="my-target-element"></div>
  </body>
</html>
```

# API

### Init
The init command starts the Hopara Visualization and returns a hopara instance that can be used to further interactions
```js
const hopara = Hopara.init(config)
```

### Update
Use the update command to update any config passed previously in the init command.
```js
...
const hopara = Hopara.init(config)
hopara.update({accessToken: 'newAccessToken'})
...
```

### Hopara Instance
```typescript
{
  // When triggered Hopara Visualization will reload every data source on the view
  reload: () => void
}
```

### Hopara Config
```typescript
{
  // The visualization id
  visualizationId: string

  // The visualization id to be used if the visualizationId is not found
  fallbackVisualizationId: string

  // Short-lived token provided by Auth API used for authentication in API calls
  accessToken: string

  // Long-lived token used to obtain a new accessToken when the current one expires.
  refreshToken: string | undefined

  // Switch the theme mode to dark scheme (default: false)
  darkMode: boolean | undefined

  // Load data at render time
  dataLoaders: DataLoader[] | undefined

  // The initial row (e.g. asset) to position the visualization
  initialRow: InitialRow | undefined

  // Custom controller to be used on Hopara Visualization
  controller: HoparaController | undefined

  // Filters to be added on data fetches
  filters: Filter[] | undefined

  // Functions called when callback actions are triggered
  callbacks: CallbackFunction[]

  // Defines Hopara language, if not set the browser config will be use. Supported values 'en', 'pt-BR'. 
  language: string | undefined
}
```

### Data Loader
Use data loaders to write custom ways to fetch data using javascript functions.

```typescript
type DataLoader = {
  // data source name
  source: string
  
  // function name
  query: string

  // function implementation
  loader: (filterSet: {limit: number, offset:number, filters: any[]}) => Promise<Record<string, any>[]>
}
```


#### Example

```javascript
const customDataLoaders = [{
  query: 'queryName',
  source: 'dataSourceName',
  loader: async () => {
    return [
      {
        id: 1,
        name: 'Eiffel Tower',
        country: 'France',
        longitude: 48.85845461500544,
        latitude: 2.294467845588995
      },
      {
        id: 2,
        name: 'Liberty Statue',
        country: 'USA',
        longitude: 40.68815550804761,
        latitude: -74.02620077137483
      },
      {
        id: 3,
        name: 'Great Wall of China',
        country: 'China',
        longitude: 40.43211592595951,
        latitude: 116.57040708445938,
      }
    ]
  }
}]

Hopara.init({
  visualizationId: 'my-hopara-viz',
  accessToken: 'my-hopara-token',
  targetElementId: 'my-target-element',
  dataLoaders: customDataLoaders,
})
```

### Initial Row
The initial row prop centers the visualization around a specific row (e.g. asset, facility).

```typescript
type InitialRow = {
  layerId: string
  rowId: string
}
```

### Manual refresh
You can manually trigger a data refresh by calling the refresh method. This will result in all data loaders being called again.

```html
const hopara = Hopara.init({
  visualizationId: 'my-hopara-viz',
  accessToken: 'my-hopara-token',
  targetElementId: 'my-target-element',
})

// force data refresh every 3 seconds
setInterval(() => {
  if (!hopara) return
  hopara.refresh()
}, 3000)
```

### Filter
When adding a filter, the field name is handled as a dimension in Hopara.

```jsx
Hopara.init({
  visualizationId: 'my-hopara-viz',
  accessToken: 'my-hopara-token',
  targetElementId: 'my-target-element',
  filters: [
    {
      field: 'type',
      values: ['REFRIGERATOR', 'FREEZER'],
    }
  ],
})
```

### Callback Function
You can implement custom interactions by adding callback actions to a layer. When the user selects an object in the visualization and click on the action the registered javascript function will be called with the associated row data. 

```typescript
type CallbackFunction = {
  name: string
  callback: (row) => void
}
```

```jsx
Hopara.init({
  visualizationId: 'my-hopara-viz',
  accessToken: 'my-hopara-token',
  targetElementId: 'my-target-element',
  callbacks: [
    {
      name: 'my-callback-action',
      callback: (row) => {
        console.log('Callback triggered', row)
      }
    }
  ],
})
```