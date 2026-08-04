/** Serialização segura de BigInt em JSON (valores em centavos). */
export function registerBigIntJson() {
  if ((BigInt.prototype as { toJSON?: () => number }).toJSON) return;

  Object.defineProperty(BigInt.prototype, 'toJSON', {
    value(this: bigint) {
      const asNumber = Number(this);
      if (!Number.isSafeInteger(asNumber)) {
        throw new TypeError(`BigInt ${this.toString()} exceeds Number.MAX_SAFE_INTEGER`);
      }
      return asNumber;
    },
    configurable: true,
    writable: true,
  });
}
