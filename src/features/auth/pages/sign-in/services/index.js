export async function signInApi({ email, password }) {
  console.log("Signing in with", { email, password });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { email, password };
}
