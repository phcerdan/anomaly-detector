# anomaly-detector
Using a graph representation of vascular systems, detect topological anomalies. Aneurysms.

# Server resources:

[vtk.js versus ParaViewWeb (client)](https://discourse.vtk.org/t/confusion-with-tool-selection-vtk-vs-paraview-for-web-based-volume-rendering-of-large-data-sets/1384/3).
This template use vtk.js and ParaViewWeb Server side (not for the client).

VTK as a server versus ParaView as a server: https://kitware.github.io/paraviewweb/examples/RemoteRenderer.html. Prefer ParaView server as a more tested route.

Useful posts:
- https://discourse.vtk.org/t/vtk-js-imagestream-defaultprotocol-js-incompatible-with-vtk/1734/8

The client side should use vtk.js (and maybe itk.js), the server side should use ParaviewWebServer (or vtkwebserver). Use wslink.

# React
I will use modern React (with hooks everywhere). I like React, not sure why.
For global state management, instead of redux (react-redux), I'll use the simpler [hookstate](https://github.com/avkonst/hookstate).
Babel as a transpiler from JSX (react) to regular javascript.
Webpack to bundle it (deployment).


# Needs
- [ ] Upload image to server from local.
- [ ] Expose python sgext filters (mostly from sgext.scripts) or C++ CLI
- [ ] Handle itk-vtk-viewer. Learn how to load the web workers they use (itk.js)

# Started from scratch:

`npm init` to generate a package.json

React:
```
npm install react react-dom
```

Transpiler (jsx to js)
```
npm install @babel/core @babel/preset-env @babel/preset-react --save-dev
```

Builder and bundler:
```
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin --save-dev
```

Loaders for different files
```
npm install babel-loader css-loader --save-dev
```

Eslint

```bash
npm install --save-dev \
eslint \
eslint-plugin-react \
eslint-plugin-react-hooks
```

`.eslintrc`

```
{
  "extends": ["eslint:recommended", "plugin:react/recommended"]
}
```
