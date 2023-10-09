import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = process.env.uri;
  
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const movies = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json({ a: 34, movie });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
