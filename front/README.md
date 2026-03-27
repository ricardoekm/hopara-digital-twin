## Running System Test

### Locally

ATENTION: Don't forget to comment lines in .env file case it exists!!!

```bash
yarn start-system-test-server
yarn system-test-standalone
```

if you want to debugger just use the flag --env debugger 
```bash
yarn start-system-test-server
DEBUGGER=true yarn system-test-standalone --env debugger
```

## Running Iframe Test

### Locally

```bash
yarn start-system-test-iframe-server
yarn system-test-iframe-standalone
```

if you want to debugger just use the flag --env debugger 
```bash
yarn start-system-test-iframe-server
DEBUGGER=true yarn system-test-iframe-standalone --env debugger
```

## Running Iframe
```bash
yarn start-iframe-server
yarn start-iframe-demo
```

## Desired Domain Folder Structure inside Components Project

### Assumptions
* All test files must have the same name as the component they are testing. Plus the suffix `.test` before the extension.
* Domains with few files, or the ones that we judge as "small" should have a flat structure
* Subdomains must follow the same structure but inside the root folder

### Files in the root domain folder
* `DomainName.ts`: This file might contain a class with represents the domain rules
* `DomainNameRepository.ts`: Access the serialized data gateway to return domain data 
* `DomainNameComponent.ts`: React component which is composed by views and is connected to domain
* `DomainNameContainer.ts`: React component connected to the state and the domain component
* Any other file with domain rules must be here 

### Folders
#### view/
* `DomainNameView.tsx` React file which is composed by a sort of view components. They have styles and are not connected to the domain
* Any other file containing style must be here

#### state/
In this folder will live all Redux-Saga related files. Such as
* `DomainNameReducer.tsx`
* `DomainNameActions.tsx`
* `DomainNameSaga.tsx`
* `DomainNameStore.tsx`

### Simple Example with a person domain
```
|- Person.ts
|- PersonActions.tsx
|- PersonComponent.ts
|- PersonContainer.ts
|- PersonReducer.tsx
|- PersonRepository.ts
|- PersonSaga.tsx
|- PersonStore.tsx
|- PersonView.tsx
```

### Complex Example with a person domain
```
|- Person.ts
|- Person.test.ts
|- PersonRepository.ts
|- PersonRepository.test.ts
|- PersonComponent.ts
|- PersonComponent.test.ts
|- PersonContainer.ts
|- PersonContainer.test.ts
|- view/
|   |- PersonView.tsx
|   |- PersonAvatar.tsx
|   |- PersonName.tsx
|   |- PersonEmail.tsx
|- state/
|   |- PersonReducer.tsx
|   |- PersonReducer.test.ts
|   |- PersonActions.tsx
|   |- PersonSaga.tsx
|   |- PersonSaga.test.ts
|   |- PersonStore.tsx
|- person-list/
|   |- PersonList.tsx
|   |- PersonListContainer.ts
|   |- PersonListView.tsx
|   |- PersonListReducer.tsx
|   |- PersonListActions.tsx
|   |- PersonListSaga.tsx
```
