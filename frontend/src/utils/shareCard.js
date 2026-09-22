const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
};

const LEVEL_COLORS = {
  warm: "#84A98C",
  fading: "#F59E0B",
  silent: "#EF4444",
};

export const downloadResultCard = async ({ t, mode, level, scores }) => {
  try {
    await document.fonts.ready;
    await document.fonts.load('600 96px "Cormorant Garamond"');
    await document.fonts.load('300 30px "Outfit"');
    await document.fonts.load('500 24px "JetBrains Mono"');
  } catch (e) {}

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0C0A09";
  ctx.fillRect(0, 0, W, H);

  const glowAmber = ctx.createRadialGradient(W * 0.85, H * 0.1, 0, W * 0.85, H * 0.1, 650);
  glowAmber.addColorStop(0, "rgba(245, 158, 11, 0.16)");
  glowAmber.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = glowAmber;
  ctx.fillRect(0, 0, W, H);

  const glowSage = ctx.createRadialGradient(W * 0.1, H * 0.95, 0, W * 0.1, H * 0.95, 550);
  glowSage.addColorStop(0, "rgba(132, 169, 140, 0.12)");
  glowSage.addColorStop(1, "rgba(132, 169, 140, 0)");
  ctx.fillStyle = glowSage;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.textBaseline = "alphabetic";

  ctx.font = '600 64px "Cormorant Garamond", serif';
  ctx.fillStyle = "#F5F5F4";
  ctx.fillText("Ruang", 90, 150);
  const brandW = ctx.measureText("Ruang").width;
  ctx.fillStyle = "#F59E0B";
  ctx.fillText(".", 90 + brandW, 150);

  ctx.font = '500 24px "JetBrains Mono", monospace';
  try { ctx.letterSpacing = "7px"; } catch (e) {}
  ctx.fillStyle = "rgba(245, 158, 11, 0.75)";
  const overline = `${t.test.resultOverline} · ${t.test.modes[mode]}`.toUpperCase();
  ctx.fillText(overline, 90, 212);
  try { ctx.letterSpacing = "0px"; } catch (e) {}

  ctx.strokeStyle = "rgba(120, 113, 108, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, 250);
  ctx.lineTo(W - 90, 250);
  ctx.stroke();

  ctx.font = 'italic 600 92px "Cormorant Garamond", serif';
  ctx.fillStyle = LEVEL_COLORS[level] || "#F59E0B";
  wrapText(ctx, t.test.levels[level].title, 90, 380, W - 180, 100);

  ctx.font = '300 30px "Outfit", sans-serif';
  ctx.fillStyle = "#D6D3D1";
  wrapText(ctx, t.test.levels[level].desc, 90, 470, W - 200, 44);

  const dims = ["warmth", "hostility", "indifference", "rejection"];
  let barY = 660;
  dims.forEach((dim) => {
    const value = scores[dim];
    ctx.font = '400 28px "Outfit", sans-serif';
    ctx.fillStyle = "#E7E5E4";
    ctx.fillText(t.test.dimensions[dim], 90, barY);

    ctx.font = '500 24px "JetBrains Mono", monospace';
    ctx.fillStyle = "#78716C";
    const val = `${value.toFixed(1)} / 4`;
    ctx.fillText(val, W - 90 - ctx.measureText(val).width, barY);

    const trackY = barY + 22;
    ctx.fillStyle = "#292524";
    ctx.fillRect(90, trackY, W - 180, 14);
    ctx.fillStyle = dim === "warmth" ? "#F59E0B" : "rgba(239, 68, 68, 0.8)";
    ctx.fillRect(90, trackY, (W - 180) * (value / 4), 14);

    barY += 120;
  });

  ctx.font = '300 20px "Outfit", sans-serif';
  ctx.fillStyle = "#78716C";
  wrapText(ctx, t.test.disclaimer, 90, 1180, W - 180, 30);

  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillStyle = "rgba(245, 158, 11, 0.6)";
  ctx.fillText("PROJECT RUANG · LIDM 2026", 90, 1290);
  const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = "#57534E";
  ctx.fillText(dateStr, W - 90 - ctx.measureText(dateStr).width, 1290);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "ruang-hasil-refleksi.png";
  a.click();
};
