export default defineEventHandler(async (event) => {
  setCookie(event, "auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  return { message: "Logged out successfully." };
});
