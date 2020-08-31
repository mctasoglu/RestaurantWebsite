class MealPlan {
  constructor(
    planName,
    resName,
    price,
    description,
    days,
    recurrence,
    startDate,
    endDate,
    meals
  ) {
    this.planName = planName;
    this.resName = resName;
    this.price = price;
    this.description = description;
    this.days = days;
    this.recurrence = recurrence;
    this.startDate = startDate;
    this.endDate = endDate;
    this.meals = meals;
  }
}

let planConverter = {
  toFirestore: function (plan) {
    return {
      planName: plan.planName,
      resName: plan.resName,
      price: plan.price,
      description: plan.description,
      days: plan.days,
      recurrence: plan.recurrence,
      startDate: plan.startDate,
      endDate: plan.endDate,
      meals: plan.meals,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new MealPlan(
      data.planName,
      data.resName,
      data.price,
      data.description,
      data.days,
      data.recurrence,
      data.time,
      data.startDate,
      data.endDate,
      data.meals
    );
  },
};

export { MealPlan, planConverter };
