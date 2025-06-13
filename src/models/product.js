const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(
    name,
    description,
    summary,
    mainImage,
    sliderImages,
    slug,
    category,
    dimensions,
    price,
    discountPrice,
    imageCount,
    sku,
    stock,
    deliveryTime,
    printType,
    minOrder,
    extraFeatures,
    isActive,
    vatRate,
    tags,
    isFeatured,
    editableFields,
    id
  ) {
    this.name = name;
    this.description = description;
    this.summary = summary;
    this.mainImage = mainImage;
    this.sliderImages = sliderImages || [];
    this.slug = slug;
    this.category = category;
    this.dimensions = dimensions;
    this.price = price;
    this.discountPrice = discountPrice;
    this.imageCount = imageCount;
    this.sku = sku;
    this.stock = stock;
    this.deliveryTime = deliveryTime;
    this.printType = printType;
    this.minOrder = minOrder;
    this.extraFeatures = extraFeatures;
    this.isActive = isActive;
    this.vatRate = vatRate;
    this.tags = tags;
    this.isFeatured = isFeatured;
    this.editableFields = editableFields || [];
    if (id) this._id = new require("mongodb").ObjectId(id);
    this.createDate = Date.now();
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      return db.collection("products").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("products").insertOne(this);
    }
  }

  static async getAll() {
    const db = await getDb();
    return db.collection("products").find().sort({ createDate: -1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("products").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async getBySlug(slug) {
    const db = await getDb();
    return db.collection("products").findOne({ slug: slug });
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("products").deleteOne({ _id:  new mongodb.ObjectId(id) });
  }
}


module.exports = Product;