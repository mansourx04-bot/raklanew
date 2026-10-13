export function publicUser(user: { _id: unknown; name?: string; displayName?: string; email: string; createdAt?: Date }) {
  return {
    id: String(user._id),
    displayName: user.name ?? user.displayName ?? '',
    email: user.email,
    createdAt: user.createdAt ?? new Date(),
  };
}
