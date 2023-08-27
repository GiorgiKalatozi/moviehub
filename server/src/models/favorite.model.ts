import mongoose, { InferSchemaType, Schema } from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["tv", "movie"],
      required: true,
    },
    mediaId: {
      type: String,
      required: true,
    },
    mediaTitle: {
      type: String,
      required: true,
    },
    mediaPoster: {
      type: String,
      required: true,
    },
    mediaRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

type Favorite = InferSchemaType<typeof favoriteSchema>;

const FavoriteModel = mongoose.model<Favorite>("Favorite", favoriteSchema);

export default FavoriteModel;
