const $ = (id) => document.getElementById(id);

function n(id) {
  const v = parseFloat($(id).value);
  return Number.isFinite(v) ? v : 0;
}

function fmt(num, d = 2) {
  return num.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

function recalc() {
  const markerLength = n('markerLength');
  const piecesInMarker = Math.max(1, n('piecesInMarker'));
  const perPiece = markerLength / piecesInMarker;
  $('perPieceResult').textContent = `${fmt(perPiece, 3)} m`;
  $('sumPcs').textContent = `${fmt(perPiece, 3)} m`;

  const orderQty = n('orderQty');
  const lossPct = n('lossPct');
  const consumption = n('consumption') || perPiece;
  const beforeLoss = consumption * orderQty;
  const lossMult = 1 + lossPct / 100;
  const afterLoss = beforeLoss * lossMult;
  $('beforeLoss').textContent = `${fmt(beforeLoss, 2)} m`;
  $('afterLoss').textContent = `${fmt(afterLoss, 2)} m`;
  $('roundedLoss').textContent = `${Math.ceil(afterLoss)} m`;
  $('sumFabric').textContent = `${Math.ceil(afterLoss)} m`;

  const eff = (n('patternArea') / Math.max(0.0001, n('markerArea'))) * 100;
  $('effVal').textContent = `${fmt(eff, 1)}%`;
  const effStatus = $('effStatus');
  effStatus.classList.remove('status-warn');
  if (eff >= 85) {
    effStatus.textContent = 'Good';
  } else {
    effStatus.textContent = 'Below target';
    effStatus.classList.add('status-warn');
  }

  const layOrderQty = n('layOrderQty');
  const layersPerLay = Math.max(1, n('layersPerLay'));
  const exactLays = layOrderQty / layersPerLay;
  const laysNeeded = Math.ceil(exactLays);
  const lastLayPcs = layOrderQty - (laysNeeded - 1) * layersPerLay;
  $('exactLays').textContent = fmt(exactLays, 2);
  $('laysNeeded').textContent = `${laysNeeded}`;
  $('lastLayPcs').textContent = `${Math.max(0, lastLayPcs)} pcs`;

  const costPerPcs = n('spread') + n('cut') + n('bundle') + n('recut');
  const totalCut = costPerPcs * n('costOrderQty');
  $('costPerPcs').textContent = `₹${fmt(costPerPcs, 2)}`;
  $('totalCutCost').textContent = `₹${fmt(totalCut, 0)}`;

  const factory = n('factoryCost');
  const overhead = n('overheadPct') / 100;
  const profit = n('profitPct') / 100;
  const multi = 1 + overhead + profit;
  const fob = factory * multi;
  $('fobMulti').textContent = fmt(multi, 2);
  $('fobPrice').textContent = `₹${fmt(fob, 2)}`;
  $('marginAdded').textContent = `₹${fmt(fob - factory, 2)}`;
  $('sumFob').textContent = `₹${fmt(fob, 2)}`;
}

document.querySelectorAll('input').forEach((el) => {
  el.addEventListener('input', recalc);
});

recalc();
