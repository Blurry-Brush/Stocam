"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropDown, setDropDown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      let response = await fetch("/api/products", {
        method: "GET",
      });
      response = await response.json();
      // console.log(response.products);
      setProducts(response.products);
    };
    fetchProducts();
  }, [products]);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("product added successfully");
        setAlert("Your product has been added!");
        setProductForm({});
      } else {
        console.log("Error adding product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleDropDown = async (e) => {
    e.preventDefault();
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropDown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropDown(rjson.products);
      setLoading(false);
    } else {
      setDropDown([]);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));

    if (action === "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    let indexDrop = dropDown.findIndex((item) => item.slug == slug);
    let newDropDown = JSON.parse(JSON.stringify(dropDown));

    if (action === "plus") {
      newDropDown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropDown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropDown(newDropDown);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    console.log(r.message);
    setLoadingAction(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto w-4/5 p-8">
        <div className="text-green-800 text-center mb-2">{alert}</div>
        <h1 className="text-2xl font-bold mb-4">Search a Product</h1>
        <div className="flex items-center mb-4">
          <input
            // onBlur={() => {
            //   setDropDown([]);
            // }}
            onChange={handleDropDown}
            value={query}
            type="text"
            className="w-full px-4 py-2 border rounded-l focus:outline-none"
            placeholder="Enter product name"
          />
          <select className="border rounded-r px-4 py-2">
            <option value="all">All Categories</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        {loading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 50 50"
            style={{ margin: "auto", display: "block" }}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="black"
              strokeWidth="4"
              strokeMiterlimit="10"
              strokeDasharray="31.415,31.415"
              transform="rotate(0 25 25)"
            >
              <animateTransform
                attributeName="transform"
                dur="2s"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        )}
        <div className="dropdowncontainer bg-purple-100 rounded-md absolute w-[70vw] border-1">
          {dropDown.map((item) => {
            return (
              <div
                className="container flex justify-between my-1 p-2 border-b-2"
                key={item._id}
              >
                <span>
                  {item.slug} ({item.quantity} available for ₹{item.price}){" "}
                </span>
                <div className="mx-3 space-x-3">
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("minus", item.slug, item.quantity);
                    }}
                    className="bg-purple-600 text-white text-xl py-2 px-3 rounded-lg cursor-pointer hover:bg-purple-500 disabled:bg-purple-200"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("plus", item.slug, item.quantity);
                    }}
                    className="bg-purple-600 text-white text-xl py-2 px-3 rounded-lg cursor-pointer hover:bg-purple-500 disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto w-4/5 p-8">
        <h1 className="text-2xl font-bold mb-4">Add a Product</h1>
        <form className="mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productName"
            >
              Product Slug
            </label>
            <input
              name="slug"
              onChange={handleChange}
              value={productForm?.slug || ""}
              type="text"
              id="productName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productQuantity"
            >
              Product Quantity
            </label>
            <input
              name="quantity"
              onChange={handleChange}
              type="number"
              value={productForm?.quantity || ""}
              id="productQuantity"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product Quantity"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productPrice"
            >
              Product Price
            </label>
            <input
              name="price"
              onChange={handleChange}
              value={productForm?.price || ""}
              type="number"
              id="productPrice"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product price"
            />
          </div>
          <button
            type="submit"
            onClick={addProduct}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="container w-4/5 mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Current Stock</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{product.slug}</td>
                <td className="py-2 px-4 border-b">₹{product.price}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
