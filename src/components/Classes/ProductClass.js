class Product {
  constructor(name, imagePath, items) {
    this.name = name;
    this.imagePath = imagePath;
    this.items = items;
  }
  toString() {
    return this.name + ", " + this.imagePath;
  }
}

// Firestore data converter
let productConverter = {
  toFirestore: function (product) {
    return {
      name: product.name,
      imagePath: product.imagePath,
      items: product.items,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Product(data.name, data.imagePath, data.items);
  },
};

export { Product, productConverter };
