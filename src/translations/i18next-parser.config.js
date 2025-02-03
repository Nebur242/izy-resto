export default {
  contextSeparator: '_',

  createOldCatalogs: true,

  defaultNamespace: 'translation',

  defaultValue: '',

  indentation: 2,

  keepRemoved: false,

  keySeparator: '.',
  lexers: {
    hbs: ['HandlebarsLexer'],
    handlebars: ['HandlebarsLexer'],

    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],

    mjs: ['JavascriptLexer'],
    js: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],

    default: ['JavascriptLexer'],
  },

  lineEnding: 'auto',

  locales: ['en', 'fr'],

  namespaceSeparator: ':',

  output: 'src/locales/$LOCALE.json',

  input: ['src/**/*.{js,jsx,ts,tsx}'],

  reactNamespace: false,

  sort: false,

  skipDefaultValues: false,

  useKeysAsDefaultValue: false,

  verbose: false,

  customValueTemplate: null,
};
