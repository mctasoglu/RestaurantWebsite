class Meal {
  constructor(
    name,

    imagePath,
    items,
    days,
    time,
    description,
    isFav
  ) {
    this.name = name;
    this.imagePath = imagePath;
    this.items = items;
    //this.restaurantName = restaurantName;
    this.days = days;

    this.time = time;
    this.description = description;
    this.isFav = isFav;
    this.url = "";
    //this.week = week;
  }
}

// Firestore data converter
let mealConverter = {
  toFirestore: function (meal) {
    return {
      name: meal.name,
      imagePath: meal.imagePath,
      items: meal.items,
      days: meal.days,
      time: meal.time,
      description: meal.description,
      isFav: meal.isFav,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Meal(
      data.name,
      data.imagePath,
      data.items,
      data.days,
      data.time,
      data.description,
      data.isFavorite
    );
  },
};

export { Meal, mealConverter };
