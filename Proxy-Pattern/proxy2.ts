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
  private static itsItemData: Map<number, ItemData> = new Map();

  constructor() {}
  static storeProductData(pd: ProductData) {
    const id = pd.sku;
    this.itsProductData.set(id, pd);
  }
  static storeItemData(i: ItemData) {
    const id = i.orderId;
    this.itsItemData.set(id, i);
  }

  static getProductData(sku: string) {
    const result = this.itsProductData.get(sku);
    return result ? result : undefined;
  }

  static getOrderData(oi: number) {
    const result = this.itsOrderData.get(oi);
    return result;
  }

  static clear() {
    this.itsProductData = new Map();
    this.itsOrderData = new Map();
    this.itsItemData = new Map();
  }
  static newOrder(customerId: string) {
    const newMaxOrderId = this.getMaxOrderId() + 1;
    this.itsOrderData.set(
      newMaxOrderId,
      new OrderData(customerId, newMaxOrderId)
    );
    return new OrderData(customerId, newMaxOrderId);
  }

  static getItemsForOrder(orderId: number): ItemData[] {
    const result: ItemData[] = [];

    for (const item of this.itsItemData.values()) {
      if (item.orderId === orderId) {
        result.push(item);
      }
    }

    return result;
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

export interface IOrder {
  getCustomerId(): string;
  addItem(p: IProduct, quantity: number): void;
  total(): number;
}

export class OrderImp implements IOrder {
  private itsItems: Map<IProduct, number> = new Map();
  private itsCustomerId!: string;

  getCustomerId() {
    return this.itsCustomerId;
  }

  constructor(cusId: string) {
    this.itsCustomerId = cusId;
  }

  addItem(p: IProduct, q: number) {
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
export class OrderProxy implements IOrder {
  public orderId!: number;

  constructor(oId: number) {
    this.orderId = oId;
  }

  getCustomerId(): string {
    const od = DB.getOrderData(this.orderId);
    if (!od) throw new Error(`OrderData not found for orderId=${this.orderId}`);
    return od.customerId;
  }

  addItem(p: IProduct, quantity: number): void {
    const id = new ItemData(this.orderId, quantity, p.getSku());
    DB.storeItemData(id);
  }

  total(): number {
    const customerId = this.getCustomerId();
    const imp = new OrderImp(customerId);

    // ★ DB.getItemsForOrder() がないのでここで安全に処理
    const items = this.getItemsForOrderSafe();

    for (const item of items) {
      imp.addItem(new ProductProxy(item.sku), item.qty);
    }

    return imp.total();
  }

  // 仮で安全にアイテム一覧を取得する内部関数（DBの拡張がまだなら）
  private getItemsForOrderSafe(): ItemData[] {
    const items: ItemData[] = [];
    for (const item of (DB as any).itsItemData?.values?.() || []) {
      if (item.orderId === this.orderId) {
        items.push(item);
      }
    }
    return items;
  }
}

export class ItemData {
  public orderId!: number;
  public qty!: number;
  public sku = "junk";
  constructor(orderId: number, qty: number, sku: string) {
    this.orderId = orderId;
    this.qty = qty;
    this.sku = sku;
  }
  equals(o: Object) {
    return (
      o instanceof ItemData &&
      this.orderId == o.orderId &&
      this.qty == o.qty &&
      this.sku == o.sku
    );
  }
}
