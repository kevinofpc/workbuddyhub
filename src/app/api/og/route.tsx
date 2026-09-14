export function GET(request: Request) {
  return Response.redirect(new URL("/og-workbuddy.png", request.url), 307);
}
