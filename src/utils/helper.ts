export const getPrompt = (diff: string) => `
You're a senior software engineer reviewing a pull request.
Add good icons to make it look attractive, nice to read.

Please do the following:
1. Provide a high-level summary of what this diff is doing.
2. Identify any potential issues, bad practices, or improvements.
3. Suggest inline comments (with file names and line numbers if possible) for critical feedback.
4. Give a release note.

Here is the diff:
${diff}
`;
