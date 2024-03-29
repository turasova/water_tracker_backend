import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
//import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import Jimp from "jimp";
import * as crypto from "node:crypto";

const avatarsDir = path.join(process.cwd(), "public/avatars");

export const getCurrentUser = (req, res) => {
  const { email, avatarURL = "", gender, waterRate, name = "" } = req.user;
  res.status(200),
    json({
      email,
      avatarURL,
      gender,
      waterRate,
      name,
    });
};

export const updateInfoUser = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword) {
    throw HttpError(400, "New password not found");
  }
  if (oldPassword === newPassword) {
    throw HttpError(
      400,
      "The new password must be different from the old password"
    );
  }
  const passwordCompare = await bcrypt.compare(oldPassword, req.user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Old password is wrong");
  }

  if (newPassword) {
    delete req.body.oldPassword;
    req.body.password = await bcrypt.hash(newPassword, 10);
    delete req.body.newPassword;
  }

  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id.req.body);

  const { name = "", gender, email } = user;
  res.status(200).json({
    email,
    name,
    gender,
  });
};

export const uploadAvatarUser = (req, res) => {};

// import User from "../models/user.js";
// import * as fs from "node:fs/promises";
// import * as path from "node:path";
// import Jimp from "jimp";
// import HttpError from "../helpers/HttpError.js";
// import * as crypto from "node:crypto";

// const avatarsDir = path.join(process.cwd(), "public/avatars");

// async function uploadAvatar(req, res, next) {
//   try {
//     if (!req.file) {
//       throw HttpError(400, "Avatar must be provided");
//     }
//     const { _id } = req.user;
//     const { path: tmpUpload, originalname } = req.file;

//     if (!req.user) {
//       throw HttpError(401, { message: "Not authorized" });
//     }
//     await Jimp.read(tmpUpload)
//       .then((avatar) => {
//         return avatar.resize(250, 250).quality(60).write(tmpUpload);
//       })
//       .catch((error) => {
//         throw error;
//       });

//     const prefix = crypto.randomUUID();
//     const fileName = `${prefix}_${_id}_${originalname}`;
//     const publicUpload = path.join(avatarsDir, fileName);

//     await fs.rename(tmpUpload, publicUpload);
//     const avatarURL = path.join("avatars", fileName);
//     await User.findByIdAndUpdate(_id, { avatarURL });

//     res.json({
//       avatarURL,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export default uploadAvatar;
