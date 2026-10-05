/** output lines the terminal can print directly — same shape as Terminal's Line,
 *  minus the prompt/block kinds the tools never emit. */
export type TermLine = { kind: "out" | "err"; text: string };

export const out = (text: string): TermLine => ({ kind: "out", text });
export const err = (text: string): TermLine => ({ kind: "err", text });
