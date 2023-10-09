import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let { action, slug, initialQuantity } = await request.json();

  const uri = process.env.uri;

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const filter = { slug: slug };
    const newQuantity =
      action === "minus"
        ? parseInt(initialQuantity) - 1
        : parseInt(initialQuantity) + 1;

    if (newQuantity === 0) {
      //delete the product
      const result = await inventory.deleteOne(filter);

      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} documents deleted`,
      });
    } else {
      const updateDoc = {
        $set: {
          quantity: newQuantity,
        },
      };

      const result = await inventory.updateOne(filter, updateDoc);
      return NextResponse.json({
        success: true,
        message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      });
    }
  } finally {
    await client.close();
  }
}
