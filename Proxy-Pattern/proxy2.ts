export class Product {
  private itsPrice: number;
  private itsName: string;
  constructor(name: string, price: number) {
    this.itsName = name;
    this.itsPrice = price;
  }
  getPrice() {
    return this.itsPrice;
  }
}

export class Item {
  private itsProduct: Product;
  private itsQuantity = 0;
  constructor(p: Product, q: number) {
    this.itsProduct = p;
    this.itsQuantity = q;
  }
  getProduct() {
    return this.itsProduct;
  }
  getQuantity() {
    return this.itsQuantity;
  }
}

export class Order {
  private itsCustomer = "";
  private itsItemList: Array<Item> = [];
  constructor(c: string) {
    this.itsCustomer = c;
  }
  addItem(p: Product, q: number) {
    this.itsItemList.push(new Item(p, q));
  }
  total() {
    let t = this.itsItemList.reduce((accu, cur) => {
      let p = cur.getProduct();

      return accu + p.getPrice() * cur.getQuantity();
    }, 0);
    return t;
  }
}

export class ProductData {
  public name = "";
  public price = 0;
  public sku = "";
  constructor(name: string, price: number, sku: string) {
    this.name = name;
    this.price = price;
    this.sku = sku;
  }
  equals(o: any) {
    if (
      o instanceof ProductData &&
      o.name == this.name &&
      o.price == this.price &&
      this.sku == o.sku
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export class DB {
  private static itsProductData: Map<string, ProductData> = new Map();
  private static itsOrderData: Map<number, OrderData> = new Map();

  constructor() {}
  static storeProductData(pd: ProductData) {
    const id = pd.sku;
    this.itsProductData.set(id, pd);
  }

  static getProductData(sku: string) {
    const result = this.itsProductData.get(sku);
    return result ? result : undefined;
  }

  static clear() {
    this.itsProductData = new Map();
    this.itsOrderData = new Map();
  }
  static newOrder(customerId: string) {
    const newMaxOrderId = this.getMaxOrderId() + 1;
    this.itsOrderData.set(
      newMaxOrderId,
      new OrderData(customerId, newMaxOrderId)
    );
  }

  static getMaxOrderId() {
    const keys = [...this.itsOrderData.keys()].filter(
      (key) => !isNaN(Number(key))
    );
    return keys.length > 0 ? Math.max(...keys) : 0;
  }
}

export interface IProduct {
  getPrice(): number;
  getName(): string;
  getSku(): string;
}

export class ProductImp implements IProduct {
  private itsPrice = 0;
  private itsName = "";
  private itsSku = "";
  constructor(sku: string, name: string, price: number) {
    this.itsSku = sku;
    this.itsName = name;
    this.itsPrice = price;
  }

  getPrice() {
    return this.itsPrice;
  }
  getSku() {
    return this.itsSku;
  }
  getName() {
    return this.itsName;
  }
}

export class ProductProxy implements IProduct {
  private itsSku = "";
  constructor(sku: string) {
    this.itsSku = sku;
  }

  private getProductData() {
    return DB.getProductData(this.itsSku);
  }

  getPrice() {
    const d = this.getProductData();
    return d ? d.price : 0;
  }
  getSku() {
    return this.itsSku;
  }
  getName() {
    const d = this.getProductData();
    return d ? d.name : "";
  }
}

export class OrderData {
  public customerId!: string;
  public orderId!: number;
  constructor(customerId: string, orderId: number) {
    this.customerId = customerId;
    this.orderId = orderId;
  }
}

export interface Order {
  getCustomerId(): string;
  addItem(p: Product, quantity: number): void;
  total(): number;
}

export class OrderImp implements Order {
  private itsItems: Map<Product, number> = new Map();
  private itsCustomerId!: string;

  getCustomerId() {
    return this.itsCustomerId;
  }

  constructor(cusId: string) {
    this.itsCustomerId = cusId;
  }

  addItem(p: Product, q: number) {
    this.itsItems.set(p, q);
  }

  total() {
    try {
      let total = 0;

      this.itsItems.forEach((q, p) => {
        total += p.getPrice() * q;
      });

      return total;
    } catch (e) {
      throw e;
    }
  }
}

export class OrderProxy implements Order {}
