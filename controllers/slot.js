const { models } = require("mongoose");
const { addDays, today } = require("../utils/utils");

async function slotGet(req, res) {
  try {
    const Slot = req.app.get("models").Slot;
    const MySlots = await Slot.find().populate("coach").populate("customers");
    if (!MySlots) {
      req.flash("error", "Can't find slots");
      return res.redirect("back");
    }
    let currentDate = today();
    if (req.query.date) {
      let year = req.query.date.substring(0,4);
      let month = req.query.date.substring(4,6);
      let day = req.query.date.substring(6);
      currentDate.setFullYear(year, month, day);
    } else {
      currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
    }
    let friday = addDays(currentDate, 4);
    friday.setHours(23, 0, 0, 0);
    let cb = v => v.date >= currentDate && v.date <= friday;
    const remains = MySlots.filter(cb);
    return res.render("slots.ejs", {
      user: req.user,
      slots: remains,
      monday: currentDate,
      friday: friday,
    });
  } catch (error) {
    return res.json(error.message);
  }
}

async function slotCreate(req, res) {
  if (!isAuthorized(req.user.role)) {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  try {
    if (!req.body.title) {
      req.flash("error", "Title field is missing");
    return res.redirect("back");
    }
    if (!req.body.startHour || !req.body.startMin) {
      req.flash("error", "Time fields are missing");
      return res.redirect("back");
    }
    if (!req.body.duration) {
      req.flash("error", "Duration field is missing");
      return res.redirect("back");
    }
    if (!req.body.peopleLimit) {
      req.flash("error", "Seats field is missing");
      return res.redirect("back");
    }
    if (!req.body.date) {
      req.flash("error", "Date is missing");
      return res.redirect("back");
    }
    const models = req.app.get("models");
    let coach = await models.Coach.findOne({user: req.user._id});
    if (!coach) {
      req.flash("error", "Coach not found");
      return res.redirect("back");
    }
    let start = parseInt(req.body.startHour);
    let dur = parseInt(req.body.duration);
    let endHour = start + dur;

    const newSlot = await new models.Slot({
      date: req.body.date,
      startHour: req.body.startHour,
      endHour: endHour,
      title: req.body.title,
      peopleLimit: req.body.peopleLimit,
      coach: coach._id,
      customers: [],
    }).save();

    coach.slots.push(newSlot._id);
    await coach.save();

    req.flash("info", "Slot successfully save");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function slotUpdate(req, res) {
  if (!isAuthorized(req.role)) {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id || !req.body.toModify) {
      return res.json("_id or toModify missing");
    }
    const Slot = req.app.get("models").Slot;
    const SlotToModify = await Slot.findById(req.body._id);
    if (!SlotToModify) {
      return res.json("Slot not found");
    }
    const KeysToModify = Object.keys(req.body.toModify);
    for (const key of KeysToModify) {
      SlotToModify[key] = req.body.toModify[key];
    }
    await SlotToModify.save();
    return res.json(SlotToModify);
  } catch (error) {
    return res.json(error.message);
  }
}

async function slotDelete(req, res) {
  if (!isAuthorized(req.role)) {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      return res.json("_id missing");
    }
    const Slot = req.app.get("models").Slot;
    const SlotToDelete = await Slot.findById(req.body._id);
    if (!SlotToDelete) {
      return res.json("Slot not found");
    }

    for (const customer of SlotToDelete.customers) {
      let _customer = await models.Customer.findById(customer);
      let index = _customer.slots.indexOf(SlotToDelete._id);
      _customer.slots.splice(index, 1);
      await _customer.save();
    }

    let coach = await models.Coach.findById(coach);
    let index = coach.slots.indexOf(SlotToDelete._id);
    coach.slots.splice(index, 1);
    await coach.save();

    await SlotToDelete.remove();
    res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

async function slotBook(req, res) {
  if (req.role !== "customer") {
    return res.json("unauthorized");
  }
  try {
    const models = req.app.get("models");
    const slot = await models.Slot.findById(req.body.slot);

    if (slot.customers.lenght >= slot.peopleLimit) {
      return res.json("No spot left for this spot");
    }

    const customer = await models.Customer.findById(req.body.customer).populate(
      "subscriptions"
    );

    let isSubscribed = false;
    for (const subscription of customer.subscriptions) {
      if (
        subscription.startDate <= slot.date &&
        subscription.endDate >= slot.date
      ) {
        isSubscribed = true;
      }
    }

    if (isSubscribed) {
      slot.customers.push(customer._id);
      await slot.save();
      customer.slots.push(slot._id);
      await customer.save();
      return res.json("Successfully booked");
    } else {
      return res.json("Customer has no valid subscription for this date");
    }
  } catch (error) {
    return res.json(error.message);
  }
}

function isAuthorized(role) {
  if (role === "manager") return true;
  if (role === "coach") return true;
  return false;
}

module.exports = { slotGet, slotCreate, slotUpdate, slotDelete, slotBook };
