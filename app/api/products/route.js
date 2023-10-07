import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = process.env.uri;

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const products = await inventory.find().toArray();
    return NextResponse.json({ products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request) {
  let body = await request.json();
  console.log(body);
  const uri =
    "mongodb+srv://mongodb:aWPscqxoR2Be8CNv@cluster0.ule8a.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const product = await inventory.insertOne(body);

    return NextResponse.json({ product, ok: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
