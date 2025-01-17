# Getting started with GUAC Visualizer

## About

The GUAC Visualizer is an experimental utility that can be used to interact with
the GUAC services. It acts as a way to visualize the software supply chain graph
as well as a means to explore the supply chain, and prototype policies.

Since the GUAC Visaulizer is still in an early experimental stage, it is likely
that there may be some unexpected behavior or usage problems. For a more robust
use of GUAC, we recommend using the [GraphQL interface directly](https://github.com/guacsec/guac/blob/main/demo/GraphQL.md).

## Requirements

**Tools:**

- yarn
- docker

### Services

To use the GUAC visualizer, you need to have the main GUAC server running. For more information on how to do this, click
[here](https://docs.guac.sh/getting-started/).

## Getting started

If you already haven't, clone the GUAC visualizer repo. We highly suggest
cloning it in the same path as you clone the main
[GUAC repo](https://github.com/guacsec/guac).

```bash
git clone git@github.com:guacsec/guac-visualizer.git
```

Change directories into the repo.

```bash
cd guac-visualizer
```

All commands run throughout this guide should be in this working directory.

## Running the visualizer from source

Install the dependencies:

```bash
yarn install
```

The output should look like:

````
$ yarn install
yarn install v1.22.19
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
warning Pattern ["@apollo/client@latest"] is trying to unpack in the same destination "/Users/lumb/Library/Caches/Yarn/v6/npm-@apollo-client-3.7.12-9ddd355d0788374cdb900e5f40298b196176952b-integrity/node_modules/@apollo/client" as pattern ["@apollo/client@^3.7.10"]. This could result in non-deterministic behavior, skipping.
[3/4] 🔗  Linking dependencies...
warning "@graphql-codegen/cli > @graphql-tools/code-file-loader > @graphql-tools/graphql-tag-pluck > @babel/plugin-syntax-import-assertions@7.20.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > @graphql-codegen/typescript-react-apollo@3.3.7" has unmet peer dependency "graphql-tag@^2.0.0".
warning "cosmos-over-cytoscape > html-webpack-plugin@5.5.0" has unmet peer dependency "webpack@^5.20.0".
warning " > react-paginated-list@1.1.6" has incorrect peer dependency "react@>=16.8.25 <=16.13.1".
warning " > react-paginated-list@1.1.6" has incorrect peer dependency "react-dom@>=16.8.25 <= 16.13.1".
warning " > react-paginated-list@```markdown
1.1.6" has incorrect peer dependency "react-scripts@>=2.1.8 <=3.4.1".
[4/4] 🔨  Building fresh packages...

success Saved lockfile.
✨  Done in 28.68s.
````

## Configuration

By default, the GUAC Visualizer assumes that the GraphQL server is running on http://localhost:8080/query. However, you can optionally configure the visualizer to connect to a different GraphQL endpoint or to read from a `guac.yaml` config file from your curent working directory.

## Running the visualizer locally:

```bash
yarn dev
```

The output should look like:

```
$ yarn dev
yarn run v1.22.19
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
```

You can then go to [localhost:3000](http://localhost:3000) in your browser to
see the graph visualization.

<hr />
<br />

### Using the GUAC visualizer will look something like this:

<br />

![image](https://github.com/guacsec/guac-visualizer/assets/68356865/0b5460e2-0252-4ba6-8052-bb3426956410)
