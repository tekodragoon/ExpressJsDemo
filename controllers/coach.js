const { models } = require("mongoose");
const encryptPassword = require("../utils/encryptPassword");

async function coachGet(req, res) {
  try {
    const Coach = req.app.get("models").Coach;
    let MyCoachs;
    if (req.query.discipline) {
      MyCoachs = await Coach.find({
        discipline : req.query.discipline
      }).populate("user");
    } else {
      MyCoachs = await Coach.find().populate("user");
    }
    return res.json(MyCoachs);
  } catch (error) {
    return res.json(error.message);
  }
}

async function coachCreate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body.password) {
      return res.json("No password provided");
    }
    
    const models = req.app.get("models");
    const {token, salt, hash} = encryptPassword(req.body.password);
    const newUser = await new models.User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      dateOfBirth: req.body.dateOfBirth,
      role: req.body.role ?? "coach"
    }).save();
    const newCoach = await new models.Coach({
      user: newUser._id,
      bio: req.body.bio ?? "No bio for this coach",
      discipline: req.body.discipline ?? "Multisport",
      slots: []
    }).save();
    return res.json(newCoach);
  } catch (error) {
    return res.json(error.message);
  }
}

async function coachUpdate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id || !req.body.toModify) {
      return res.json("_id or toModify missing");
    }
    const Coach = req.app.get("models").Coach;
    const coachToModify = await Coach.findById(req.body._id);
    if (!coachToModify) {
      return res.json("coach not found");
    }
    const KeysToModify = Object.keys(req.body.toModify);
    for (const key of KeysToModify) {
      coachToModify[key] = req.body.toModify[key];
    }
    await coachToModify.save();
    return res.json(coachToModify);
  } catch (error) {
    return res.json(error.message);
  }
}

// TODO: check booking
async function coachDelete(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      return res.json("_id missing");
    }
    const Coach = req.app.get("models").Coach;
    const coachToDelete = await Coach.findById(req.body._id);
    if (!coachToDelete) {
      return res.json("coach not found");
    }
    const UserToDelete = await models.User.findById(coachToDelete.user);
    if (!UserToDelete) {
      return res.json("User not found");
    }
    await UserToDelete.remove();
    await coachToDelete.remove();
    return res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = { coachGet, coachCreate, coachUpdate, coachDelete };