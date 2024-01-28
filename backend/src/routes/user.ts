import express from "express";
import { UserModel } from "../models/User";

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" },
				currentCommunityId: {$first: "$currentCommunityId"},
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	try {
	  const { userId, communityId } = req.params;
  
	  const existingUser = await UserModel.findById(userId).exec();
	  if (existingUser?.currentCommunityId) {
		if (existingUser?.currentCommunityId === communityId) {
			return res.status(400).send({ message: `User is already part of this community` });
		} else 
		return res.status(400).send({
			 message: `This user is already a part of a community: `,
			 communityId: existingUser?.currentCommunityId
	 });
	  } 
  
	  const updatedUser = await UserModel.findByIdAndUpdate(userId, { currentCommunityId: communityId }, { new: true }).exec();

	  return res.send(updatedUser);

	} catch (error) {
	  return res.status(500).send({ message: `Error joining community, couldn't update user` });
	}
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
	try {
		const { userId, communityId } = req.params;
		const existingUser = await UserModel.findById(userId).exec();

		if (existingUser?.currentCommunityId && existingUser?.currentCommunityId !== null) {
			if (existingUser.currentCommunityId === communityId) {
				const updatedUser = await UserModel.findByIdAndUpdate(userId, { currentCommunityId: null }, { new: true }).exec();
				return res.send(updatedUser);
			}
			return res.status(400).send({ 
				message: `Couldn't leave community, this user is part of a different community: `,
				communityId: existingUser.currentCommunityId
			});
		} else {
			return res.status(400).send({ message: `Couldn't leave community, the user is presently part of no community` });
		}
		
	  } catch (error) {
		return res.status(500).send({ message: `Error leaving community, couldn't update user` });
	  }
});



export {
    userRouter
}
