export const money = (v) =>
  "R$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export const calcNet = (gross, tax, expenses) => {
  const effT = Math.max(tax || 0, 10);
  const afterTax = gross * (1 - effT / 100);
  const expTotal = (expenses || []).reduce(
    (s, e) => s + (parseFloat(e.valor) || 0),
    0
  );
  return parseFloat((afterTax - expTotal).toFixed(2));
};
