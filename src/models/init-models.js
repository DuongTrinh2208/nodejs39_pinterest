import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _comment from  "./comment.js";
import _image from  "./image.js";
import _save_image from  "./save_image.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  const comment = _comment.init(sequelize, DataTypes);
  const image = _image.init(sequelize, DataTypes);
  const save_image = _save_image.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);

  image.belongsToMany(user, { as: 'user_id_users', through: save_image, foreignKey: "image_id", otherKey: "user_id" });
  user.belongsToMany(image, { as: 'image_id_images', through: save_image, foreignKey: "user_id", otherKey: "image_id" });
  comment.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(comment, { as: "comments", foreignKey: "image_id"});
  save_image.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(save_image, { as: "save_images", foreignKey: "image_id"});
  comment.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(comment, { as: "comments", foreignKey: "user_id"});
  image.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(image, { as: "images", foreignKey: "user_id"});
  save_image.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(save_image, { as: "save_images", foreignKey: "user_id"});

  return {
    comment,
    image,
    save_image,
    user,
  };
}
