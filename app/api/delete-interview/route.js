import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { mockId } = await req.json();
    
    console.log("Received mockId:", mockId);

    if (!mockId) {
      return NextResponse.json(
        { success: false, error: "mockId missing" },
        { status: 400 }
      );
    }

    // 1️⃣ Delete user answers linked to interview
    console.log("Deleting UserAnswers...");
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId)); // 👈 Changed mockId to mockIdRef

    // 2️⃣ Delete interview row
    console.log("Deleting MockInterview...");
    await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    console.log("Delete successful!");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE ERROR:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { db } from "@/utils/db";
// import { MockInterview, UserAnswer } from "@/utils/schema";
// import { eq } from "drizzle-orm";

// export async function POST(req) {
//   try {
//     const { mockId } = await req.json();

//     if (!mockId) {
//       return NextResponse.json(
//         { success: false, error: "mockId missing" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Delete user answers linked to interview
//     await db.delete(UserAnswer).where(eq(UserAnswer.mockId, mockId));

//     // 2️⃣ Delete interview row
//     await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

//     return NextResponse.json({ success: true });
//   } catch (e) {
//     console.error("DELETE ERROR:", e);
//     return NextResponse.json(
//       { success: false, error: e.message },
//       { status: 500 }
//     );
//   }
// }
