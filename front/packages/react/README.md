# @hopara/react
This package provides a react component to add [Hopara](https://hopara.io) visualizations to your project.

## Requirements
The [Hopara](https://hopara.io) component is built on top of [React](https://react.dev/).

## Installing
### Package manager
Using npm:
```shell
$ npm install --save @hopara/react
```

Using yarn:
```shell
$ yarn add @hopara/react
```

Once installed, you can import the library using import or require:
```jsx
import {Hopara} from '@hopara/react';
```

## Authentication
The component requires a valid `accessToken`. Use the `Auth API` to fetch it, as explained in our [integration guide][integration guide](https://docs.hopara.app/#/docs/integration-guide/2-authentication-integration.html)

## Examples
### Basic usage
```jsx
<div className="HoparaEmbedded">
  <Hopara
    visualizationId="your-visualization-id"
    accessToken="your-access-token"
  />
</div>
```

## Module API
You can further customize the integration by using the component props:

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

  // Overwrites data at render time
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

### Controller
You can provide a Hopara Controller to manually trigger a data refresh (i.e. fetch all data again).

#### Example

```jsx
import {Hopara, HoparaController} from '@hopara/react'
const customController = new HoparaController()

<div className="HoparaEmbedded">
  <Hopara
    visualizationId="your-visualization-id"
    accessToken="your-access-token"
    controller={customController}
  />
</div>
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

```jsx
const dataLoaders = [{
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
...
<div className="HoparaEmbedded">
  <Hopara
    visualizationId="your-visualization-id"
    accessToken="your-access-token"
    dataLoaders={dataLoaders}
  />
```

### Initial Row
The initial row prop centers the visualization around a specific row (e.g. asset, facility).

```typescript
type InitialRow = {
  layerId: string
  rowId: string
}
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
