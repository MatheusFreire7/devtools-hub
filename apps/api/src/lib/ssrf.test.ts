import { describe, expect, it } from 'vitest';

import { isRestrictedIp } from './ssrf.js';

describe('isRestrictedIp', () => {
  it('blocks IPv4 private and loopback ranges', () => {
    expect(isRestrictedIp('127.0.0.1')).toBe(true);
    expect(isRestrictedIp('10.0.0.1')).toBe(true);
    expect(isRestrictedIp('172.16.5.4')).toBe(true);
    expect(isRestrictedIp('192.168.1.1')).toBe(true);
  });

  it('blocks reserved, link-local, multicast and test ranges', () => {
    expect(isRestrictedIp('0.0.0.0')).toBe(true);
    expect(isRestrictedIp('169.254.10.10')).toBe(true);
    expect(isRestrictedIp('100.64.0.1')).toBe(true);
    expect(isRestrictedIp('192.0.2.1')).toBe(true);
    expect(isRestrictedIp('198.51.100.2')).toBe(true);
    expect(isRestrictedIp('203.0.113.3')).toBe(true);
    expect(isRestrictedIp('224.0.0.1')).toBe(true);
    expect(isRestrictedIp('240.0.0.1')).toBe(true);
    expect(isRestrictedIp('255.255.255.255')).toBe(true);
  });

  it('allows public IPv4 addresses', () => {
    expect(isRestrictedIp('93.184.216.34')).toBe(false);
    expect(isRestrictedIp('1.1.1.1')).toBe(false);
    expect(isRestrictedIp('8.8.8.8')).toBe(false);
  });

  it('blocks IPv6 loopback, ULA, link-local and multicast ranges', () => {
    expect(isRestrictedIp('::1')).toBe(true);
    expect(isRestrictedIp('::')).toBe(true);
    expect(isRestrictedIp('fc00::1')).toBe(true);
    expect(isRestrictedIp('fdb8:1::1')).toBe(true);
    expect(isRestrictedIp('fe80::1')).toBe(true);
    expect(isRestrictedIp('ff02::1')).toBe(true);
  });

  it('allows public IPv6 addresses', () => {
    expect(isRestrictedIp('2606:2800:220:1:248:1893:25c8:1946')).toBe(false);
    expect(isRestrictedIp('2001:4860:4860::8888')).toBe(false);
  });

  it('blocks IPv4-mapped IPv6 wrappers of private addresses', () => {
    expect(isRestrictedIp('::ffff:127.0.0.1')).toBe(true);
    expect(isRestrictedIp('::ffff:192.168.0.5')).toBe(true);
    expect(isRestrictedIp('::ffff:10.1.2.3')).toBe(true);
  });

  it('allows IPv4-mapped IPv6 wrappers of public addresses', () => {
    expect(isRestrictedIp('::ffff:93.184.216.34')).toBe(false);
  });

  it('treats non-IP strings as restricted', () => {
    expect(isRestrictedIp('example.com')).toBe(true);
    expect(isRestrictedIp('not-an-ip')).toBe(true);
  });
});
