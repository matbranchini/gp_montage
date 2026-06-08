"""
Ottimizzazione immagini progetti per GP Montage.
- Salva gli originali in assets/img/progetti/_originali/ (se non gia' presenti)
- Ridimensiona a max 1200px di larghezza
- Ricomprime in JPEG (qualita' 82)
- Genera versione WebP (qualita' 80)
Gli originali non vengono mai sovrascritti.
"""
import shutil
from pathlib import Path
from PIL import Image

BASE = Path(__file__).parent / "assets" / "img" / "progetti"
ORIG = BASE / "_originali"
MAX_W = 1200
JPEG_Q = 82
WEBP_Q = 80

ORIG.mkdir(exist_ok=True)

# Estensioni immagine da processare (escludendo png decorativi piccoli)
exts = {".jpg", ".jpeg", ".png"}

results = []

for img_path in sorted(BASE.iterdir()):
    if img_path.is_dir():
        continue
    if img_path.suffix.lower() not in exts:
        continue

    # 1) Backup originale (una sola volta)
    backup = ORIG / img_path.name
    if not backup.exists():
        shutil.copy2(img_path, backup)

    # Lavora sempre dalla copia originale per evitare perdita di qualita' cumulativa
    src = backup if backup.exists() else img_path

    before_kb = round(img_path.stat().st_size / 1024)

    with Image.open(src) as im:
        # Converti in RGB se necessario (per JPEG)
        orig_w, orig_h = im.size

        # Ridimensiona mantenendo proporzioni, solo se piu' largo del limite
        if orig_w > MAX_W:
            ratio = MAX_W / orig_w
            new_size = (MAX_W, round(orig_h * ratio))
            im = im.resize(new_size, Image.LANCZOS)

        # --- JPEG ottimizzato (sovrascrive il .jpg/.jpeg servito) ---
        if img_path.suffix.lower() in {".jpg", ".jpeg"}:
            rgb = im.convert("RGB")
            rgb.save(img_path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        else:
            # png: ottimizza ridimensionato mantenendo formato
            im.save(img_path, optimize=True)

        # --- WebP affiancato ---
        webp_path = img_path.with_suffix(".webp")
        im_webp = im.convert("RGB") if im.mode in ("P", "RGBA", "LA") else im
        im_webp.save(webp_path, "WEBP", quality=WEBP_Q, method=6)
        webp_kb = round(webp_path.stat().st_size / 1024)

    after_kb = round(img_path.stat().st_size / 1024)
    results.append((img_path.name, before_kb, after_kb, webp_kb))

print(f"{'File':<32}{'Prima':>10}{'Dopo(JPG)':>12}{'WebP':>10}")
print("-" * 64)
tot_b = tot_a = tot_w = 0
for name, b, a, w in results:
    print(f"{name:<32}{b:>8} KB{a:>9} KB{w:>7} KB")
    tot_b += b
    tot_a += a
    tot_w += w
print("-" * 64)
print(f"{'TOTALE':<32}{tot_b:>8} KB{tot_a:>9} KB{tot_w:>7} KB")
print(f"\nWebP vs originale: -{round((1 - tot_w / tot_b) * 100)}%")
