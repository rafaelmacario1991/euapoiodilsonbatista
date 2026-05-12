import sys

FILE = r"C:\Users\pc\Desktop\landing-pages-mike\dilson-batista\index.html"

with open(FILE, encoding="utf-8") as f:
    html = f.read()

# Marcadores de início de cada seção
MARKERS = [
    "<!-- ===== HERO",
    "<!-- ===== ALERTA",
    "<!-- ===== PERSEGUI",
    "<!-- ===== VÍD",
    "<!-- ===== ABAIXO-ASSINADO",
    "<!-- ===== O PROBLEMA",
    "<!-- ===== QUEM",
    "<!-- ===== FAQ",
    "<!-- ===== COMPARTILHAR",
    "<!-- ===== FOOTER",
    "<!-- ===== STICKY",
]

# Encontra posição de cada marcador
positions = []
for m in MARKERS:
    idx = html.find(m)
    if idx == -1:
        print(f"AVISO: não encontrado: {m}", file=sys.stderr)
    else:
        positions.append(idx)

positions.sort()
positions.append(len(html))  # sentinela final

# Extrai cada bloco
blocks = {}
labels = ["hero","alerta","perseg","video","form","prob","cand","faq","share","footer","sticky"]
for i, label in enumerate(labels):
    blocks[label] = html[positions[i]:positions[i+1]]

# Monta arquivo na nova ordem:
# head + hero + alerta + form + video + prob + cand + perseg + faq + share + footer + sticky

# "head" é tudo antes do comentário <!-- ===== HERO
head = html[:positions[0]]

novo = (head
    + blocks["hero"]
    + blocks["alerta"]
    + blocks["form"]
    + blocks["video"]
    + blocks["prob"]
    + blocks["cand"]
    + blocks["perseg"]
    + blocks["faq"]
    + blocks["share"]
    + blocks["footer"]
    + blocks["sticky"])

with open(FILE, "w", encoding="utf-8") as f:
    f.write(novo)

print("Reordenado com sucesso!")
print("Nova ordem: hero > alerta > form > video > prob > cand > perseg > faq > share > footer > sticky")
