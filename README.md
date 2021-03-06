# [![Angular Playground](./assets/angular-playground.png)](./assets/angular-playground.png)

Build Angular components, directives, and pipes in isolation.

Playground is a living styleguide for your Angular components, taking the components you already
wrote and providing an environment that makes it easy to visualize changes, document variations, and
fix broken UI.

[![npm version](https://badge.fury.io/js/angular-playground.svg)](https://badge.fury.io/js/angular-playground)
[![build status](https://travis-ci.org/SoCreate/angular-playground.svg?branch=master)](https://travis-ci.org/SoCreate/angular-playground)


> [Watch our 2018 Angular Meetup Talk](https://www.youtube.com/watch?v=QfvwQEJVOig&t)

## Documentation (<http://www.angularplayground.it/>)

* Angular 6.x and up
* [CLI quick-start](http://www.angularplayground.it/docs/getting-started/angular-cli)

### Added features

* Categories - if you add a label to the [SandboxOfConfig object](http://www.angularplayground.it/docs/api/sandbox), it will be used as a category in the top level of the command bar menu. If no label is used, the sandbox is assigned to a Default category.

```typescript
export default sandboxOf( 
    LgDropdownComponent,
    {
        label: "Controls",
        imports: 
        []
        /* ... */
    }
)
```

* Subgroups / Scenario Groups - Every scenario of sandbox can be assigned to a group of scenarios. This group then becomes a third level item in the command bar menu. A group can be configured by appending *; subgroup:custom-group-name* to the end of the scenario description.

```typescript
 .add('default; subgroup:Group 1', {} 
```

## Articles

* [Developing and Running Components in a Sandbox!](https://blog.codewithdan.com/2017/11/21/angular-playground-developing-and-running-components-in-a-sandbox/)
* [Front-end Workflows: Re-envisioned](https://hackernoon.com/front-end-workflow-re-envisioned-43f800bb01bd)

## Contributing

Help Angular Playground by contributing!

### [Contributing Guide](./CONTRIBUTING.md)

Please read our [contributing guide](./CONTRIBUTING.md) to learn about filing issues, submitting PRs, and buliding
Angular Playground.

### License

Angular Playground is [MIT licensed](./LICENSE).

## Latest Changes

[Playground Changelog](./packages/angular-playground/CHANGELOG.md)
