import type { Player } from "../global/game-manager";

const ENDPOINT =
  "https://686b863de559eba90872e9f1.mockapi.io/api/leaderboard/players";

export async function getUsers(): Promise<Player[]> {
  const res = await fetch(`${ENDPOINT}`);

  return (await res.json()) ?? [];
}

export async function getUser(name: string): Promise<Player | undefined> {
  const res = await fetch(`${ENDPOINT}`);
  const json: Array<Record<string, unknown>> = await res.json();

  if (json.length > 0) {
    const user = json.find((data) => data["name"] === name);
    if (user) return user as unknown as Player;
  }

  return undefined;
}

export async function upsertUser(
  name: string,
  highestScore?: number
): Promise<Player | undefined> {
  let user = await getUser(name);

  console.log(user)
  if (!user) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, highestScore: highestScore ?? 0 }),
    });

    user = (await res.json()) as unknown as Player;
    return user;
  }

  const score = highestScore ?? user.highestScore ?? 0;

  const res = await fetch(`${ENDPOINT}/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      highestScore: score,
    }),
  });

  user = (await res.json()) as unknown as Player;
  return user;
}
