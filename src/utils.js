export const isServer =
    process && process.release && process.release.name === 'node';
