import {
  expect,
  vi,
  describe,
  it,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { DB, Order, Product, ProductData, ProductProxy } from "./proxy2.js";

describe("proxy2", () => {
  it("testOrderPrice", () => {
    const o = new Order("Bob");
    const toothPaste = new Product("ToothPaste", 129);
    o.addItem(toothPaste, 1);
    expect(o.total()).toEqual(129);
    const mouthWash = new Product("MouthWash", 342);
    o.addItem(mouthWash, 2);
    expect(o.total()).toEqual(813);
  });

  it("testDB testStore product", () => {
    const storedProduct = new ProductData("MyProduct", 1234, "999");

    DB.storeProductData(storedProduct);
    const retrievedProduct = DB.getProductData("999");
    expect(storedProduct.equals(retrievedProduct)).toBe(true);
  });

  it("testDB testNoProduct", () => {
    const r = DB.getProductData("none");
    expect(r).toBeUndefined();
  });
});

describe("productProxy", () => {
  beforeEach(() => {
    DB.clear();
    const p = new ProductData("TestName1", 456, "ProxyTest1");
    DB.storeProductData(p);
  });

  it("test ProdcutProxy", () => {
    const p = new ProductProxy("ProxyTest1");
    expect(p.getPrice()).toEqual(456);
    expect(p.getSku()).toEqual("ProxyTest1");
    expect(p.getName()).toEqual("TestName1");
  });
});

describe("orderProxy", () => {
  it("testOrderProxyTotal", () => {
    DB.storeProductData(new ProductData("Wheaties", 349, "wheaties"));
    DB.storeProductData(new ProductData("Crest", 258, "crest"));
    const wheaties = new ProductProxy("wheaties");
    const crest = new ProductProxy("crest");

    const od = DB.newOrder("testOrderProxy");
    const order = new OrderProxy(od.orderId);
    order.addItem(crest, 1);
    order.addItem(wheaties, 2);
    expect(order.total()).toEqual(956);
  });

  it("testOrderKeyGeneration", () => {
    const o1 = DB.newOrder("Bob");
    const o2 = DB.newOrder("Bill");
    const firstOrderId = o1.orderId;
    const secondOrderId = o2.orderId;
    expect(firstOrderId + 1).toEqual(secondOrderId);
  });
});
