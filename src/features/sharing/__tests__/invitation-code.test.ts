import { isValidInvitationCode, normalizeInvitationCode } from '../invitation-code';

it('normalizes what the user types', () => {
  expect(normalizeInvitationCode(' abc-234 ')).toBe('ABC234');
  expect(normalizeInvitationCode('7hj yux')).toBe('7HJYUX');
});

it.each([
  ['ABC234', true],
  ['7HJYUX', true],
  ['ABC23', false],
  ['ABC2345', false],
  ['ABC0O1', false],
  ['abc234', false],
])('validates %s', (code, expected) => {
  expect(isValidInvitationCode(code)).toBe(expected);
});
