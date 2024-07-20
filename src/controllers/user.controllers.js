import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { username, email, password, fullName } = req.body;
  if (
    [username, email, password, fullName].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new apiError(400, "This field is must Required");
  }

  if (email != /^[^\s@]+@[^\s@]+\.[^\s@]+\.com$/) {
    throw new apiError(400, "Please enter valid Email Address");
  }

  const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new apiError(409, "This user is Already Exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("Filess...", req.files.avatar);
  const coverImageLoacalPath = req.files?.coverImage[0]?.path;
  console.log("Filess...2", req.files.avatar);

  if (!avatarLocalPath) {
    throw new apiError(400, "avataar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLoacalPath);

  if (!avatar) {
    throw new apiError(400, "avataar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new apiResponse(200, createdUser, "User has been successfully registered")
    );
});

export default registerUser;
