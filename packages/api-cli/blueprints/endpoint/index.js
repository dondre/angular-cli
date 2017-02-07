const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Blueprint = require('../../ember-cli/lib/models/blueprint');
const dynamicPathParser = require('../../utilities/dynamic-path-parser');
const findParentModule = require('../../utilities/find-parent-module').default;
const getFiles = Blueprint.prototype.files;
const stringUtils = require('ember-cli-string-utils');
const astUtils = require('../../utilities/ast-utils');
const NodeHost = require('@api-cli/ast-tools').NodeHost;
const schema_1 = require('./schema');

module.exports = {
  description: '',

  availableOptions: [
    { name: 'schemapath', type: String, default: null },
    { name: 'schema', type: String, default: null },
    { name: 'flat', type: Boolean, default: false },
    { name: 'inline-template', type: Boolean, aliases: ['it'] },
    { name: 'inline-style', type: Boolean, aliases: ['is'] },
    { name: 'prefix', type: String, default: null },
    { name: 'spec', type: Boolean },
    { name: 'view-encapsulation', type: String, aliases: ['ve'] },
    { name: 'change-detection', type: String, aliases: ['cd'] },
    { name: 'skip-import', type: Boolean, default: true },
    { name: 'module', type: String, aliases: ['m'] },
    { name: 'export', type: Boolean, default: false }
  ],

  beforeInstall: function(options) {

    if(options.schemapath) {
      let schema = this.readFile(options.schemapath)
      if(!schema) {
        throw new Error("Error: Schema filepath invalid");
      }
      this.schema = schema;
      let error = schema_1.SchemaUtil.isValidJson(schema);
      if(error){
        console.error("Error: JSON schema invalid");
        throw error;
      }
    } else if (options.schema) {
      let error = schema_1.SchemaUtil.isValidJson(options.schema);
      if(error){
        console.error("Error: JSON schema invalid");
        throw error;
      }
      this.schema = options.schema;
    }

  },
  schema: '',

  normalizeEntityName: function (entityName) {
    var parsedPath = dynamicPathParser(this.project, entityName);

    this.dynamicPath = parsedPath;

    var defaultPrefix = '';
    if (this.project.ngConfig &&
        this.project.ngConfig.apps[0] &&
        this.project.ngConfig.apps[0].prefix) {
      defaultPrefix = this.project.ngConfig.apps[0].prefix;
    }

    var prefix = (this.options.prefix === 'false' || this.options.prefix === '') ? '' : (this.options.prefix || defaultPrefix);
    prefix = prefix && `${prefix}-`;

    this.selector = stringUtils.dasherize(prefix + parsedPath.name);

    return parsedPath.name;
  },

  locals: function (options) {
    this.styleExt = 'css';
    if (this.project.ngConfig &&
        this.project.ngConfig.defaults &&
        this.project.ngConfig.defaults.styleExt) {
      this.styleExt = this.project.ngConfig.defaults.styleExt;
    }

    options.schema = options.schema !== undefined ? 
      options.schema :
      this.project.ngConfigObj.get('defaults.schema');

    options.schemapath = options.schemapath !== undefined ? 
      options.schemapath :
      this.project.ngConfigObj.get('defaults.schemapath');

    options.inlineStyle = options.inlineStyle !== undefined ?
      options.inlineStyle :
      this.project.ngConfigObj.get('defaults.inline.style');

    options.inlineTemplate = options.inlineTemplate !== undefined ?
      options.inlineTemplate :
      this.project.ngConfigObj.get('defaults.inline.template');

    options.spec = options.spec !== undefined ?
      options.spec :
      this.project.ngConfigObj.get('defaults.spec.component');

    options.viewEncapsulation = options.viewEncapsulation !== undefined ?
      options.viewEncapsulation :
      this.project.ngConfigObj.get('defaults.viewEncapsulation');

    options.changeDetection = options.changeDetection !== undefined ?
      options.changeDetection :
      this.project.ngConfigObj.get('defaults.changeDetection');

    return {
      dynamicPath: this.dynamicPath.dir.replace(this.dynamicPath.appRoot, ''),
      flat: options.flat,
      spec: options.spec,
      inlineTemplate: options.inlineTemplate,
      inlineStyle: options.inlineStyle,
      route: options.route,
      isAppComponent: !!options.isAppComponent,
      selector: this.selector,
      styleExt: this.styleExt,
      schema: options.schema,
      schemapath: options.schemapath,
      viewEncapsulation: options.viewEncapsulation,
      changeDetection: options.changeDetection
    };
  },

  files: function() {
    var fileList = getFiles.call(this);

    // if (this.options && this.options.inlineTemplate) {
    //   fileList = fileList.filter(p => p.indexOf('.html') < 0);
    // }
    // if (this.options && this.options.inlineStyle) {
    //   fileList = fileList.filter(p => p.indexOf('.__styleext__') < 0);
    // }
    // if (this.options && !this.options.spec) {
    //   fileList = fileList.filter(p => p.indexOf('__name__.component.spec.ts') < 0);
    // }

    return fileList;
  },

  fileMapTokens: function (options) {
    // Return custom template variables here.
    return {
      __path__: () => {
        var dir = this.dynamicPath.dir;
        if (!options.locals.flat) {
          dir += path.sep + options.dasherizedModuleName;
        }
        var srcDir = this.project.ngConfig.apps[0].root;
        this.appDir = dir.substr(dir.indexOf(srcDir) + srcDir.length);
        this.generatePath = dir;
        return dir;
      },
      __styleext__: () => {
        return this.styleExt;
      }
    };
  },

  readWriteSync(filepath, entryRegex, entryText, commaTest, tabs) {
    var addComma = '';
    var addReturn = '';
    var backTabs = ''
    var data = fs.readFileSync(filepath, 'utf-8');
    if(commaTest) {
      addComma = data.indexOf(commaTest) > -1 ? '' : ',';
      addReturn = addComma ? '' : '\r\n';
      backTabs = tabs;
    }
    var newValue = data.replace(entryRegex, entryRegex + '\r\n' + entryText + addComma + addReturn + backTabs);
    fs.writeFileSync(filepath, newValue, 'utf-8');
  },

  findReplaceFile(filepath, entryRegex, entryText) {
    var data = fs.readFileSync(filepath, 'utf-8');
    var newValue = data.replace(entryRegex, entryText);
    fs.writeFileSync(filepath, newValue, 'utf-8');
  },

  readFile(filepath) {
    let data = null; 
    try {
      data = fs.readFileSync(filepath, 'utf-8');
    } catch (err) { }
    return data;
  },

  afterInstall: function(options) {
    if (options.dryRun) {
      return;
    }

    const returns = [];
    const className = stringUtils.classify(options.entity.name);
    const fileName = stringUtils.dasherize(options.entity.name);
    const name = (options.entity.name);

    let model = options.target + '/src/models/' + name + '.ts';
    if(this.schema) {
      this.findReplaceFile(model, "jsonSchema = { }","jsonSchema = " + this.schema);
    }

    let apiDoc = options.target + '/apidoc.json';
    this.readWriteSync(apiDoc, '"paths": { ', '\t\t"/'+name+'": {\r\n\t\t\t"200": { }\r\n\t\t}', '"paths": { }','\t');
    let context = options.target + '/src/dal/context/index.ts';
    this.readWriteSync(context, "from './mongo';", "import { I"+ className + " } from '../../models/" + name + "';");
    this.readWriteSync(context, "export interface IDataContext { ", "\t"+name +"s: IRepository<I"+className+">", 'IDataContext { }','');
    let mongoContext = options.target + '/src/dal/context/mongo.ts';
    this.readWriteSync(mongoContext, "from '../connection/mongo';","import { "+name+"Repository } from '../../models/"+name+"';");
    this.readWriteSync(mongoContext, 'dbContext = { ','\t\t\t\t'+name+'s: '+ name+'Repository(dbSettings)','let dbContext = { };','\t\t\t');
    let apiRoute = options.target + '/src/api/routes/index.ts';
    this.readWriteSync(apiRoute,"from '../../dal/context';","import { "+name+"Routes } from './"+name+"';")
    this.readWriteSync(apiRoute,"init: (app, context:IDataContext) => { ","\t\t\t"+name+"Routes(app, context)", "(app, context:IDataContext) => { }",'\t\t')
    let apiController = options.target + '/src/api/controllers/index.ts';
    this.readWriteSync(apiController,"from '../../dal/context';", "import { "+className+"Controller } from './"+name+"';")
    this.readWriteSync(apiController,"class Controllers {","\tpublic "+className+": "+className+"Controller;")
    this.readWriteSync(apiController,"constructor(context:IDataContext) {","\t\tthis."+className+" = new "+className+"Controller(context);")

    return Promise.all(returns);
  }
};
