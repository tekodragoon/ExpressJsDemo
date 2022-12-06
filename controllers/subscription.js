const flash = require("express-flash");
const { models } = require("mongoose");

async function subscribeNow(req, res) {
  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  const Customer = req.app.get("models").Customer;
  const customer = await Customer.findById(req.user.customerId).populate("subscriptions");
  if (!customer) {
    req.flash("error", "Customer not found");
    return res.redirect("back");
  }
  return res.render("subscribe.ejs", {
    user: req.user,
    customer: customer
  });
}

async function subscriptionGet(req, res) {
  try {
    const Subscription = req.app.get("models").Subscription;
    const MySubscriptions = await Subscription.find().populate("customer");
    if (!MySubscriptions) {
      return res.json("Error find subscriptions");
    }
    return res.json(MySubscriptions);
  } catch (error) {
    return res.json(error.message);
  }
}

async function subscriptionCreate(req, res) {
  try {
    if (!req.body.customer) {
      req.flash("error", "Customer missing");
      return res.redirect("back");
    }
    if (!req.body.startDate) {
      req.flash("error", "Start date missing");
      return res.redirect("back");
    }
    if (!req.body.duration) {
      req.flash("error", "Duration missing");
      return res.redirect("back");
    }
    if (!req.body.paymentMethod) {
      req.flash("error", "Payment method missing");
      return res.redirect("back");
    }
    if (!req.body.amountPaid) {
      req.flash("error", "Amount missing");
      return res.redirect("back");
    }
    const models = req.app.get("models");
    let customer = await models.Customer.findById(req.body.customer);
    if (!customer) {
      req.flash("error", "Customer not found");
      return res.redirect("back");
    }

    let startDt = new Date(req.body.startDate);
    let endDt = new Date();
    endDt.setDate(startDt.getDate() + parseInt(req.body.duration));
    let amount = parseInt(req.body.amountPaid);

    const newSubscription = await new models.Subscription({
      startDate: startDt,
      endDate: endDt,
      paymentMethod: req.body.paymentMethod,
      amountPaid: amount,
      customer: req.body.customer,
    }).save();

    customer.subscriptions.push(newSubscription._id);
    await customer.save();

    req.flash("info", "Subscription complete");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function subscriptionUpdate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id || !req.body.toModify) {
      return res.json("_id or toModify missing");
    }
    const Subscription = req.app.get("models").Subscription;
    const SubscriptionToModify = await Subscription.findById(req.body._id);
    if (!SubscriptionToModify) {
      return res.json("Subscription not found");
    }
    const KeysToModify = Object.keys(req.body.toModify);
    for (const key of KeysToModify) {
      SubscriptionToModify[key] = req.body.toModify[key];
    }
    await SubscriptionToModify.save();
    return res.json(SubscriptionToModify);
  } catch (error) {
    return res.json(error.message);
  }
}

async function subscriptionDelete(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      return res.json("_id missing");
    }
    const Subscription = req.app.get("models").Subscription;
    const SubscriptionToDelete = await Subscription.findById(req.body._id);
    if (!SubscriptionToDelete) {
      return res.json("Subscription not found");
    }
    let customer = await models.Customer.findById(
      SubscriptionToDelete.customer
    );
    let index = customer.subscriptions.indexOf(SubscriptionToDelete._id);
    customer.subscriptions.splice(index, 1);
    await customer.save();

    await SubscriptionToDelete.remove();
    return res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = {
  subscriptionGet,
  subscriptionCreate,
  subscriptionUpdate,
  subscriptionDelete,
  subscribeNow,
};
