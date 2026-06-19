const {
  webpack,
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

const moduleFederationConfig = withModuleFederationPlugin({
  name: 'mf-finance',
  filename: 'remoteEntry.js',
  exposes: {
    './SupplierModule': './src/app/modules/supplier/supplier.module.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
    '@neocore/lib-components': {
      singleton: false,
      strictVersion: false,
      requiredVersion: false,
    },
  },
});

// moduleFederationConfig.output.publicPath = "https://nc.aseguradoradelsur.com/security/";
moduleFederationConfig.output.publicPath = "http://localhost:4202/";

module.exports = moduleFederationConfig;



// module.exports = withModuleFederationPlugin({

//   name: 'mf-finance',

//   exposes: {
//     './Component': './src\app\app.component.ts',
//   },

//   shared: {
//     ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
//   },

// });
