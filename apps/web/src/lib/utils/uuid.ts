const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function generateUuidV4(): string {
  return crypto.randomUUID();
}

export function generateUuids(count: number, uppercase = false): string[] {
  const safeCount = Math.min(Math.max(Math.trunc(count) || 1, 1), 100);
  return Array.from({ length: safeCount }, () => {
    const uuid = generateUuidV4();
    return uppercase ? uuid.toUpperCase() : uuid;
  });
}

export function isValidUuidV4(uuid: string): boolean {
  return UUID_V4_PATTERN.test(uuid);
}
