import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

export class RestrictedAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestrictedAddressError';
  }
}

const PRIVATE_SUBNETS = [
  '0.0.0.0/8', // "this network"
  '10.0.0.0/8', // private
  '100.64.0.0/10', // carrier-grade NAT
  '127.0.0.0/8', // loopback
  '169.254.0.0/16', // link-local
  '172.16.0.0/12', // private
  '192.0.0.0/24', // IETF protocol assignments
  '192.0.2.0/24', // TEST-NET-1
  '192.168.0.0/16', // private
  '198.18.0.0/15', // network benchmark
  '198.51.100.0/24', // TEST-NET-2
  '203.0.113.0/24', // TEST-NET-3
  '224.0.0.0/4', // multicast
  '240.0.0.0/4', // reserved
  '255.255.255.255/32', // broadcast
  '::/128', // unspecified
  '::1/128', // loopback
  'fc00::/7', // unique local (ULA)
  'fe80::/10', // link-local
  'ff00::/8', // multicast
  '2001:db8::/32', // documentation
] as const;

function buildBlockList(): BlockList {
  const list = new BlockList();
  for (const subnet of PRIVATE_SUBNETS) {
    const [address = '', prefixString = ''] = subnet.split('/');
    const prefix = Number(prefixString);
    const family = isIP(address) === 6 ? 'ipv6' : 'ipv4';
    list.addSubnet(address, prefix, family);
  }
  return list;
}

const privateAddresses = buildBlockList();

function unwrapIpv4Mapped(ip: string): string | null {
  if (!ip.toLowerCase().startsWith('::ffff:')) return null;
  const tail = ip.slice(7);
  return tail.includes('.') && isIP(tail) === 4 ? tail : null;
}

export function isRestrictedIp(ip: string): boolean {
  const embeddedV4 = unwrapIpv4Mapped(ip);
  if (embeddedV4) return privateAddresses.check(embeddedV4, 'ipv4');

  const family = isIP(ip);
  if (family === 0) return true;

  return privateAddresses.check(ip, family === 4 ? 'ipv4' : 'ipv6');
}

export function hostnameOfUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.hostname;
  } catch {
    return null;
  }
}

/**
 * DNS-rebinding-safe check: resolve a hostname and require every resolved
 * address to be public. Throws {@link RestrictedAddressError} otherwise.
 */
export async function assertPublicHostname(hostname: string): Promise<string[]> {
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  for (const { address } of addresses) {
    if (isRestrictedIp(address)) {
      throw new RestrictedAddressError(
        `Refusing to connect to ${hostname}: it resolves to a private or reserved address.`,
      );
    }
  }
  return addresses.map(({ address }) => address);
}
