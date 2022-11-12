const { models } = require("mongoose");

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
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body.customer) {
      return res.json("No customer provided");
    }
    const models = req.app.get("models");
    let startDt = new Date();
    let endDt = new Date();
    endDt.setDate(startDt.getDate()+1);

    let customer = await models.Customer.findById(req.body.customer);
    if (!customer) {
      return res.json("Customer not found");
    }
    s
    const newSubscription = await new models.Subscription({
      startDate: req.body.startDate ?? startDt,
      endDate: req.body.endDate ?? endDt,
      paymentMethod: req.body.paymentMethod,
      amountPaid: req.body.amountPaid,
      customer: req.body.customer
    }).save();
    
    customer.subscriptions.push(newSubscription._id);
    await customer.save();
    return res.json(newSubscription);
  } catch (error) {
    return res.json(error.message);
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
    let customer = await models.Customer.findById(SubscriptionToDelete.customer);
    let index = customer.subscriptions.indexOf(SubscriptionToDelete._id);
    customer.subscriptions.splice(index, 1);
    await customer.save();

    await SubscriptionToDelete.remove();
    return res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = { subscriptionGet, subscriptionCreate, subscriptionUpdate, subscriptionDelete };