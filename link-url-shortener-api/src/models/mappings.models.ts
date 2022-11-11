import mongoose from "mongoose";
import * as General from "../../src/util/general";

const { Schema } = mongoose;

// Getting relevant ports for UI
const { API_PORT, API_HOSTNAME } = General.setEnvironmentVariables();

// Changes the response before sending out to the client
const generateMappingSchemaOptions = () => {
  return {
    versionKey: false,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      ret.alias = `http://${API_HOSTNAME}:${API_PORT}/` + ret.alias;
      delete ret.userID;
      delete ret._id;
      return ret;
    },
  };
};

const options = {
  toJSON: {
    ...generateMappingSchemaOptions(),
  },
  toObject: {
    ...generateMappingSchemaOptions(),
  },
};

const MappingSchema = new Schema(
  {
    alias: {
      type: Schema.Types.String,
      required: false,
      default: null,
      minLength: 5,
    },
    userID: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
    originalURL: {
      type: Schema.Types.String,
      required: true,
    },
    expiration: {
      type: Schema.Types.Number,
      required: false,
      default: null,
    },
  },
  options
);

const Mapping = mongoose.model("mappings", MappingSchema);
export default Mapping;
