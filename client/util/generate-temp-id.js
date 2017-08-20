var temp = 1;

export default function generateTempID() {
  return `temp_${temp++}`;
}
