import { Resend } from "resend";

// Em ambiente de build, não precisamos inicializar o Resend
const resend =
  process.env.NODE_ENV === "production"
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(request: Request) {
  // Durante o build, não precisamos validar a chave
  if (process.env.NODE_ENV !== "production") {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await resend?.contacts.create({
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
