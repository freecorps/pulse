import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export async function POST(request: Request) {
  if (!resend) {
    return new Response(
      JSON.stringify({ error: "Newsletter service is not configured" }),
      { status: 503 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: "aa185055-7560-419c-bcfc-a8b59b08aecd",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
