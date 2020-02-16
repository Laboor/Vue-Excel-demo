const mongoose = require('mongoose');
const schema = require('../schema/schema.js');

const nativeMongoose = mongoose;
const schemasCache = new Map();
const modelsCache = new Map();

/* MongoBD options */
const dbOptions = {
  poolSize: 5,
  keepAlive: 120,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
const schemaOptions = {
  strict: true,
  versionKey: false
}

/**
 * Connect MongoDB, Listen for connection events,
 * if connection fails will Retry 3 times
 * @param {string} connectUrl
 * @param {any} [options=dbOptions] MongoBD options
 */
function connect(connectUrl, options = dbOptions) {
  let retry = 0;
  let connected = false;
  const start = Date.now();
  mongoose.connect(connectUrl, options);
  mongoose.connection.on('error', (error) => {
    console.log('MongoDB connect fail:', {
      database: mongoose.connection.name,
      error: error
    });
    let timer = setInterval(() => {
      if (retry < 3 && !connected) {
        retry += 1;
        console.log(`Try to reconnect for the ${retry} time...`);
        mongoose.connect(connectUrl, options);
      } else {
        clearInterval(timer);
      }
    }, 3000);
  })
  mongoose.connection.on('connected', () => {
    connected = true;
    console.log('MongoDB connect seccess!', {
      database: mongoose.connection.name,
      connectionTime: Date.now() - start
    });
  })
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connect disconnected', {
      database: mongoose.connection.name
    });
  })
}

/* Print the current number of connections */
function connectionsInfo() {
  mongoose.connection.db.admin().serverStatus()
    .then(
      res => console.log(res.connections)
    )
}

/* Initialization MongoDB, Create schemas and Models */
function init() {
  createSchemas();
  createModels();
}

/* Close database connection */
function close() {
  mongoose.connection.close();
  schemasCache.clear();
  modelsCache.clear();
}

/**
 * Use Mongoose middleware
 * @param {any} schema
 * @param {any} options Middleware options
 */
function useMiddleware(schema, options) {
  switch (options.hook) {
    case 'pre':
      schema.pre(options.method, options.callBack);
      break;
    case 'post':
      schema.post(options.method, options.callBack);
      break;
    default:
      schema.pre(options.method, options.callBack);
  }
}

/**
 * Create a schema, if you want to use Mongoose middleware,
 * you can add multiple configurations in middlewareOpts
 * @param {any} typeObj Schema definition
 * @param {any} [options=schemaOptions] Schema options
 * @param {any} middlewareOpts Middleware options
 * @returns {any} Mongoose schema
 */
function createSchema(typeObj, options = schemaOptions, ...middlewareOpts) {
  let newSchema = new mongoose.Schema(typeObj, options);
  if (middlewareOpts) {
    for (let opt of middlewareOpts) {
      useMiddleware(newSchema, opt);
    }
  }
  return newSchema;
}

/**
 * Create schemas from schema.js and add it in schemasCache, 
 * if you want to use Mongoose middleware,
 * you can add multiple configurations in middlewareOpts
 * @param {any} middlewareOpts
 */
function createSchemas(...middlewareOpts) {
  if (JSON.stringify(schema) == '{}'){
    throw new Error('Schema is empty,Create schemas failed');
  };
  for (let key in schema) {
    let newSchema = new mongoose.Schema(schema[key], schemaOptions);
    if (middlewareOpts) {
      for (let opt of middlewareOpts) {
        useMiddleware(newSchema, opt);
      }
    }
    schemasCache.set(key, newSchema);
  }
}

/**
 * Create a model from schema.js and add it in modelsCache
 * @param {string} modelStr Model name
 * @returns Mongoose model
 */
function createModel(modelStr) {
  if (JSON.stringify(schema) == '{}') {
    throw new Error('Schema is empty,Create model failed');
  }
  if (!modelStr in schema || modelsCache.has(modelStr)) return;
  let typeObj = schema[modelStr];
  let newModel = mongoose.model(modelStr, createSchema(typeObj));
  modelsCache.set(modelStr, newModel);
  return newModel;
}

/* Create model from schemasCache and add it in modelsCache */
function createModels() {
  if (!schemasCache.size) return;
  for (let entry of schemasCache) {
    let newModel = mongoose.model(entry[0], entry[1]);
    modelsCache.set(entry[0], newModel);
  }
}


/**
 * MongoDB database operate
 * @param {string} method Database operate
 * @param {any} options Data options required for the operation
 * @param {Function} callback (err, docs) => {}
 */
function db(method, options, callback) {
  switch (method) {
    case 'find':
      let findOptions = {
        collection: options.collection,
        conditions: options.conditions
      };
      find(findOptions, callback);
      break;
    case 'findOne':
      let findOneOptions = {
        collection: options.collection,
        conditions: options.conditions
      };
      findOne(findOneOptions, callback);
      break;
    case 'add':
      let addOptions = {
        collection: options.collection,
        data: options.data
      };
      add(addOptions, callback);
      break;
    case 'delete':
      let delOptions = {
        collection: options.collection,
        conditions: options.conditions
      };
      del(delOptions, callback);
      break;
    case 'update':
      let updateOptions = {
        collection: options.collection,
        conditions: options.conditions,
        data: options.data
      };
      update(updateOptions, callback);
      break;
    default:
      return;
  }
}

/**
 * MongoDB find operation
 * @param {any} options Data options required for the operation
 * @param {Function} callback
 */
function find(options, callback) {
  let model = modelsCache.get(options.collection);
  if (!model) return next();
  model.find(options.conditions, callback);
}

/**
 * MongoDB findOne operation
 * @param {any} options Data options required for the operation
 * @param {Function} callback
 */
function findOne(options, callback) {
  let model = modelsCache.get(options.collection);
  if (!model) return next();
  model.findOne(options.conditions, callback);
}

/**
 * MongoDB create operation
 * @param {any} options Data options required for the operation
 * @param {Function} callback
 */
function add(options, callback) {
  let model = modelsCache.get(options.collection);
  if (!model) return next();
  model.create(options.data, callback);
}


/**
 * MongoDB update operation
 * @param {any} options Data options required for the operation
 * @param {Function} callback
 */
function update(options, callback) {
  let model = modelsCache.get(options.collection);
  if (!model) return next();
  model.updateOne(options.conditions, options.data, callback);
}


/**
 * MongoDB remove operation
 * @param {any} options Data options required for the operation
 * @param {Function} callback
 */
function del(options, callback) {
  let model = modelsCache.get(options.collection);
  if (!model) return next();
  model.remove(options.conditions, callback);
}

module.exports = {
  nativeMongoose: nativeMongoose,
  dbOptions: dbOptions,
  schemaOptions: schemaOptions,
  connect: connect,
  init: init,
  db: db,
  close: close,
  schemasCache: schemasCache,
  modelsCache: modelsCache
};
