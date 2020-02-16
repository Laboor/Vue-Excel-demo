/* define Mongoose schema */
const schema = {
  city: {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    }
  },
  branch: {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    cityId: {
      type: String,
      required: true
    }
  },
  transformer: {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    branchId: {
      type: String,
      required: true
    },
    cityId: {
      type: String,
      required: true
    }
  }
}

module.exports = schema;
